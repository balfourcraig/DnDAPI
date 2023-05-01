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
        public async Task<IActionResult> LongDescription([FromBody] NPC person, int sentences = 1)
        {
            string? userKey = Request.Cookies["userKey"];
            if(userKey == null || userKey != _configuration?["UserKey"]){
                await Task.Delay(1000);
                return Unauthorized("Invalid user key");
            }
            if(person == null)
                return BadRequest("Invalid NPC object");
            string description = await GetNPCDescription(person, sentences, _configuration?["OpenAIKey"] ?? "");
            person.Description = description;
            return Json(person);
        }

        [HttpPost(Name = "Post_NPCImage")]
        public async Task<IActionResult> Image([FromBody] NPC person)
        {
            string? userKey = Request.Cookies["userKey"];
            if(userKey == null || userKey != _configuration?["UserKey"]){
                await Task.Delay(1000);
                return Unauthorized("Invalid user key");
            }
            if(person == null)
                return BadRequest("Invalid NPC object");

            string prompt = GetNPCImagePrompt(person, _configuration?["OpenAIKey"] ?? "");
            DALLEImageResponse? image = await Utils.GetDALLEImageAsync(prompt, _configuration?["OpenAIKey"] ?? "");
            if(image != null){
                person.ImageURL = image.Data[0].Url;
            }
            return Json(person);
        }

        [HttpPost(Name = "Post_NPCChat")]
        public async Task<IActionResult> Chat([FromBody] NPCChatRequest request)
        {
            NPC person = request.Person;
            string? userKey = Request.Cookies["userKey"];
            string systemPrompt = GetNPCChatPrompt(person);
            List<ChatMessage> messages = new List<ChatMessage>();
            messages.Add(new ChatMessage(Role: "System", Content: systemPrompt));
            messages.AddRange(request.Messages);
            ChatRequest chatRequest = new ChatRequest(messages.ToArray());
            ChatResponse response =  await Utils.GetGPTResponseAsync(chatRequest, _configuration?["OpenAIKey"] ?? "");
            if(response != null){
                return Json(response.Choices[0].Message);
            }
            return BadRequest("Invalid NPC object");
        }

        private static string GetNPCChatPrompt(NPC person){
            string prompt = "You are an NPC in a D&D-style roleplaying game. You are talking to a player character.";
            if(!string.IsNullOrWhiteSpace(person.Firstname))
                prompt += $" Your name is {person.Firstname}" + (string.IsNullOrWhiteSpace(person.Lastname) ? "." : $" {person.Lastname}.");
            if(!string.IsNullOrWhiteSpace(person.Race))
                prompt += $" You are {person.Race} race.";
            if(!string.IsNullOrWhiteSpace(person.Gender))
                prompt += $" You are a {(person.Gender == "M" ? "male" : "female")}.";
            if(!string.IsNullOrWhiteSpace(person.Profession))
                prompt += $" Your profession is {person.Profession}.";
            if(!string.IsNullOrWhiteSpace(person.Voice))
                prompt += $" Your voice feature is {person.Voice}.";
            if(!string.IsNullOrWhiteSpace(person.Clothing))
                prompt += $" You are wearing {person.Clothing.FormatLineBreakList()}.";
            if(!string.IsNullOrWhiteSpace(person.Loot))
                prompt += $" You are carrying {person.Loot.FormatLineBreakList()}, though some of that may be out of sight or hidden.";
            if(!string.IsNullOrWhiteSpace(person.Action))
                prompt += $" You are {person.Action}.";
            if(!string.IsNullOrWhiteSpace(person.Secret))
                prompt += $" You have a secret: {person.Secret}. Do not reveal your secret unless pushed.";
            

            prompt += ". The world setting is medieval.";
            prompt += " You do not know things outside this setting.";
            prompt += " You are moderately helpful.";
            prompt += " You can do all things a normal person can do including all their senses";
            return prompt;
        }

        private static string GetNPCImagePrompt(NPC person, string key){
            if(person.ImagePrompt != null)
                return person.ImagePrompt;

            string pronoun1 = person.Gender == "M" ? "he" : "she";
            string pronoun2 = person.Gender == "M" ? "his" : "her";
            string pronoun3 = person.Gender == "M" ? "him" : "her";

            string promptStart = "A face portrait of the following person: ";
            string promptEnd = " beautiful painting with highly detailed face by greg rutkowski and magali villanueve";
            string prompt = promptStart;

            if(!string.IsNullOrWhiteSpace(person.Clothing))
                prompt += $"{pronoun1} is wearing {person.Clothing.FormatLineBreakList()}";
            if(!string.IsNullOrWhiteSpace(person.Loot))
                prompt += $", {pronoun1} is carrying {person.Loot.FormatLineBreakList()}, though some of that may be out of sight or hidden.";
            if(!string.IsNullOrWhiteSpace(person.Action))
                prompt += $", {pronoun1} is {person.Action}";
            prompt += promptEnd;
            
            return prompt;
        }

        private static async Task<string> GetNPCDescription(NPC person, int sentences, string key){
            sentences = Math.Min(5, Math.Max(1, sentences));
            string prompt = $"Describe the following person in a short ({sentences} sentences max) paragraph: ";
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
                prompt += $", {pronoun1} is carrying {person.Loot.FormatLineBreakList()}, though some of that may be out of sight or hidden.";
            if(!string.IsNullOrWhiteSpace(person.Action))
                prompt += $", {pronoun1} is {person.Action}";
            if(!string.IsNullOrWhiteSpace(person.Flavor))
                prompt += $", a little detail about {pronoun3} is {pronoun1} is {person.Flavor}";
            if(!string.IsNullOrWhiteSpace(person.Secret))
                prompt += $", a secret about {pronoun3} is {pronoun1}: {person.Secret}, which should not be in the description but may influence it subtly.";
            prompt += "You do not need to use all this information, only enough to describe the person well.";
            
            ChatResponse? resonse = await Utils.GetGPTResponseAsync(prompt, key);
            if(resonse != null)
                return resonse.Choices[0].Message.Content;
            
            return "OpenAI API returned an error";
        }
    }
}