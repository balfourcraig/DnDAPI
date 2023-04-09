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
    public class NPCController : Controller
    {
        private readonly ILogger<NPCController> _logger;
        private IConfiguration _configuration;
        private static readonly Random r = new Random();

        public NPCController(ILogger<NPCController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        [HttpPost(Name = "Post_NPCDescription")]
        public async Task<IActionResult> LongDescription(string key, [FromBody] NPC person, int sentences = 1)
        {
            if(key != _configuration["userKey"])
                return BadRequest("Invalid API Key");
            if(person == null)
                return BadRequest("Invalid NPC object");
            string description = await GetNPCDescription(person, sentences, _configuration["OpenAIKey"]);
            return Ok(description);
        }

        [HttpPost(Name = "Post_NPCImage")]
        public async Task<IActionResult> Image(string key, [FromBody] NPC person)
        {
            if(key != _configuration["userKey"])
                return BadRequest("Invalid API Key");
            if(person == null)
                return BadRequest("Invalid NPC object");
            string description = person.Description;
            if(string.IsNullOrWhiteSpace(description))
                description = await GetNPCDescription(person, 1, _configuration["OpenAIKey"]);
            
            string promptStart = "A portrait of the following person: ";
            string promptEnd = " beautiful painting with highly detailed face by greg rutkowski and magali villanueve";
            DALLEImageResponse? image = await Utils.GetDALLEImageAsync(promptStart + description + promptEnd, _configuration["OpenAIKey"]);
            if(image != null){
                return Ok(image.Data[0].Url);
            }
            return BadRequest("No image found");
        }

        private static async Task<string> GetNPCDescription(NPC person, int sentences, string key){
            sentences = Math.Min(5, Math.Max(1, sentences));
            string prompt = "Describe the following person in a short paragraph: ";
            string pronoun1 = person.Gender == "M" ? "he" : "she";
            string pronoun2 = person.Gender == "M" ? "his" : "her";
            string pronoun3 = person.Gender == "M" ? "him" : "her";
            if(!string.IsNullOrWhiteSpace(person.Firstname))
                prompt += $"{pronoun2} name is {person.Firstname}";
            if(!string.IsNullOrWhiteSpace(person.Lastname))
                prompt += $" {person.Lastname}";
            if(!string.IsNullOrWhiteSpace(person.Voice))
                prompt += $", {pronoun1} voice feature is {person.Voice.AddArticle()}";
            if(!string.IsNullOrWhiteSpace(person.Clothing))
                prompt += $", {pronoun1} is wearing {person.Clothing.FormatLineBreakList()}";
            if(!string.IsNullOrWhiteSpace(person.Loot))
                prompt += $", {pronoun1} is carrying {person.Loot.FormatLineBreakList()}, though some of that may be hidden.";
            if(!string.IsNullOrWhiteSpace(person.Action))
                prompt += $", {pronoun1} is {person.Action}";
            if(!string.IsNullOrWhiteSpace(person.Flavor))
                prompt += $", a little detail about {pronoun3} is {pronoun1} is {person.Flavor}";
            if(!string.IsNullOrWhiteSpace(person.Secret))
                prompt += $", a secret about {pronoun3} is {pronoun1}: {person.Secret}, which should not be in the description but may influence it subtly.";
            prompt += "You do not need to use all this information, only enough to describe the person well.";
            
            var request = new ChatRequest(
                new ChatMessage[] { 
                    new ChatMessage("user", prompt) 
                }
            );
            ChatResponse? resonse = await Utils.GetGPTResponseAsync(request, key);
            if(resonse != null)
                return resonse.Choices[0].Message.Content;
            
            return "OpenAI API returned an error";
        }
    }
}