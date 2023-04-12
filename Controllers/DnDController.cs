using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DnDAPI.Extensions;
using System.Net.Http.Headers;
using Newtonsoft.Json;

namespace DnDAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class DnDController : Controller
    {
        private readonly ILogger<DnDController> _logger;
        private IConfiguration _configuration;
        private static readonly Random r = new Random();

        public DnDController(ILogger<DnDController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        [HttpGet(Name = "GetLocationName")]
        public async Task<IActionResult> ShortDescription(string key, string prompt)
        {
            if(key != _configuration["userKey"])
                return BadRequest("Invalid API Key");
            try{
                ChatResponse? response = await Utils.GetGPTResponseAsync(prompt, _configuration?["OpenAIKey"] ?? "");
                if(response != null)
                return Json(response.Choices[0].Message.Content);
            }
            catch(Exception e){
                _logger.LogError(e, "Error getting location name");
            }
            return BadRequest("OpenAI API returned an error");
        }

        [HttpGet(Name = "Post_AnyImage")]
        public async Task<IActionResult> Image(string key, string? prompt, string? theme = null)
        {
            if(key != _configuration["userKey"])
                return BadRequest("Invalid API Key");
            if(prompt == null)
                return BadRequest("No prompt");

            theme = string.IsNullOrWhiteSpace(theme) ? "" : $" in a {theme} setting";
            string promptStart = "beautiful painting of ";
            string promptEnd = " by greg rutkowski and magali villanueve";
            prompt = promptStart + prompt + theme + promptEnd;
            try{
                DALLEImageResponse? image = await Utils.GetDALLEImageAsync(prompt, _configuration?["OpenAIKey"] ?? "");
                if(image != null){
                    return Json(image.Data[0].Url);
                }
            }
            catch(Exception e){
                _logger.LogError(e, "Error getting image");
            }
            return BadRequest("OpenAI API returned an error");
        }
    }
}
