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
    [Route("api/[controller]")]
    [ApiController]
    public class CombatController : Controller
    {
        private readonly ILogger<CombatController> _logger;
        private IConfiguration _configuration;
        private static readonly Random r = new Random();

        public CombatController(ILogger<CombatController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        [HttpGet(Name = "Combat")]
        public async Task<IActionResult> Get(string weapon, string enemy, string? theme = null, string? style = null, int sentences = 1){
            string? userKey = Request.Cookies["userKey"];
            if(userKey == null || userKey != _configuration?["UserKey"]){
                await Task.Delay(1000);
                return Unauthorized("Invalid user key");
            }

            sentences = Math.Min(sentences, 5);
            sentences = Math.Max(1, sentences);
            string prompt = $"You are the DM in a {(string.IsNullOrWhiteSpace(theme) ? "" : theme + " ")}roleplaying game. Give a short ({sentences} sentence max) {(style == null ? "" : style)} description for the player of how they deliver the death blow with {weapon.AddArticle()} to {enemy.AddArticle()}.";
            ChatResponse? resonse = await Utils.GetGPTResponseAsync(prompt, _configuration?["OpenAIKey"] ?? "");
            if(resonse != null){
                return Json(
                    new { 
                        Response = resonse.Choices[0].Message.Content,
                        prompt = weapon + " " + enemy
                    }
                );
            }
            return BadRequest("OpenAI API returned an error");  
        }
    }
}
