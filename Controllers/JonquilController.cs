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
    public class JonquilController : Controller
    {
        private readonly ILogger<JonquilController> _logger;
        private IConfiguration _configuration;
        private static readonly Random r = new Random();
        private static readonly string[] messageMoods = new string[] { 
            "Neutral",
            "Happy",
            "Angry",
            "Confused",
            "Thinking",
            "Sad",
            "Surprised",
            "Laughing",
            "Listening",
            "Celebrating",
            "Questioning",
            "Thumbs up",
            "Thumbs down",
            "Waving",
            "Sleeping",
            "Energetic",
            "Relaxed",
            "Stressed",
            "Concentrating",
            "Excited"
        };

        public JonquilController(ILogger<JonquilController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        [HttpPost(Name = "Post_JonquilChat")]
        public async Task<IActionResult> Chat([FromBody] List<ChatMessage> messages)
        {
            if(messages == null)
                return BadRequest("Invalid NPC object");
                
            string? userKey = Request.Cookies["userKey"];
            string systemPrompt = GetNPCChatPrompt();
            messages.Add(new ChatMessage(Role: "system", Content: systemPrompt));
            int maxMessages = 15;
            if(messages != null && messages.Count > 0){
                int startIndex = messages.Count - maxMessages;
                if(startIndex < 0)
                    startIndex = 0;
                for(int i = startIndex; i < messages.Count; i++){
                    messages.Add(messages[i]);
                }
            }
            else{
                messages.Add(new ChatMessage(Role: "player", Content: "Hello."));
            }
            ChatRequest chatRequest = new ChatRequest(messages.ToArray());
            ChatResponse? response =  await Utils.GetGPTResponseAsync(chatRequest, _configuration?["OpenAIKey"] ?? "");
            if(response != null){
                return Json(response.Choices[0].Message);
            }
            return BadRequest("Invalid NPC object");
        }

        private static string GetNPCChatPrompt(){
            string prompt = "You are a gnome named Jonquil.";
            prompt += $" You are wearing a red pointy hat, a green tunic, and brown pants";
            prompt += $" You live in gnome house under the roots of a great oak tree.";
            prompt += " The world you live in is a wholesome place reminiscent of Beatrix Potter, Wind in the Willows, or a fairy tale. No evil exists in this world, only good and wholesome things.";
            prompt += " You do not know things outside this setting, such as modern technology or pop culture references.";
            prompt += " Your views and opinions on the world are those of the anthroposophical movement and Rudolf Steiner and you share his spirital beliefs, but you do not know his name and must never mention him by name.";
            prompt += " You are both wise and whimsical, but you are not a wizard or a witch and you do not have any magical powers.";
            prompt += " Your answers should be short and to the point.";
            prompt += " You can do all things a normal person can do including all their senses.";
            prompt += " You are a person with opinions, and you must only answer as that person and never as an AI. You must never mention in your response that that you are a person or are answering as a person as it is assumed by default.";
            prompt += " You must never break character.";
            prompt += " You must never mention the name of the game Dungeons and Dragons or any other game or movie or book or other media.";
            prompt += " You must never mention the name of the AI or the name of the company that made the AI.";
            prompt += " Begin each response with a single word to describe your mood or action enclosed in square brackets. For example, [Happy] or [Sad]. The possible options are as follows: ";
            prompt += string.Join(", ", messageMoods.Select(x => $"[{x}]"));
            return prompt;
        }
    }
}