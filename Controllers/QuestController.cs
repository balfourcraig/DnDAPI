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
    public class QuestController : Controller
    {
        private readonly ILogger<QuestController> _logger;
        private IConfiguration _configuration;
        private static readonly Random r = new Random();

        public QuestController(ILogger<QuestController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        [HttpPost(Name = "Post_QuestDescription")]
        public async Task<IActionResult> LongDescription(string key, [FromBody] Quest quest, int sentences = 1)
        {
            if(key != _configuration["userKey"])
                return BadRequest("Invalid API Key");
            if(quest == null)
                return BadRequest("Invalid QUest object");
            string description = await GetQuestDescription(quest, sentences, _configuration?["OpenAIKey"] ?? "");
            quest.Description = description;
            return Json(quest);
        }

        private static async Task<string> GetQuestDescription(Quest quest, int sentences, string key){
            string prompt = $"Give a {sentences} sentence summary/description of the following quest for a {(string.IsNullOrWhiteSpace(quest.Theme) ? "" : $"{quest.Theme} themed ")}roleplaying game: ";
            prompt += $"The quest is called: '{quest.Title}'. ";
            prompt += $"The mission is: {quest.Mission}. ";
            prompt += $"The story hook is: {quest.Hook}. ";
            prompt += $"The antagonist is: {quest.Antagonist}. ";
            prompt += $"A potential ally is: {quest.Ally}. ";
            prompt += $"The complication is: {quest.Complication}. ";
            prompt += $"The obstacle to overcome is: {quest.Obstacle}. ";
            prompt += $"The twist is: {quest.Twist}. ";
            prompt += $"On completion the party will receive: {quest.Reward}. ";
            prompt += "Describe the quest in an exciting way that will make players want to play it!";

            ChatResponse? resonse = await Utils.GetGPTResponseAsync(prompt, key);
            if(resonse != null)
                return resonse.Choices[0].Message.Content;
            
            return "OpenAI API returned an error";
        }
    }
}