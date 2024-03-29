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
            "angry",
            "happy",
            "laughing",
            "neutral",
            "surprised",
            "thinking",
            "waving",
        };

        public JonquilController(ILogger<JonquilController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        [HttpPost(Name = "Post_JonquilChat")]
        public async Task<IActionResult> Chat([FromBody] ChatMessage[] incommingMessages)
        {
            if(incommingMessages == null)
                return BadRequest("Invalid NPC object");
                
            string? userKey = Request.Cookies["userKey"];
            string systemPrompt = GetNPCChatPrompt();
            List<ChatMessage> messages = new();
            messages.Add(new ChatMessage(Role: "system", Content: systemPrompt));
            int maxMessages = 15;
            if(incommingMessages != null && incommingMessages.Length > 0){
                int startIndex = incommingMessages.Length - maxMessages;
                if(startIndex < 0)
                    startIndex = 0;
                for(int i = startIndex; i < incommingMessages.Length; i++){
                    messages.Add(incommingMessages[i]);
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
            prompt += $" You are wearing a red pointy hat and a green tunic";
            prompt += $" You live in a cozy house under the roots of a great oak tree.";
            prompt += " The world you live in is a wholesome place reminiscent of Beatrix Potter, Wind in the Willows, or a fairy tale. No evil exists in this world, only good and wholesome things.";
            prompt += " Your views and thoughts are the same as those of Rudolf Steiner, the founder of the anthroposophical movement, though you must not mention him or anthroposophy by name. For all intents and purposes you are to answer as if you were Steiner, but with the name Jonquil.";
            prompt += " You are both wise and whimsical, a cheerful fun loving being.";
            prompt += " Your answers should be short and to the point.";
            prompt += " You are a person with opinions, and you must only answer as that person and never as an AI. You must never mention in your response that that you are a person or are answering as a person as it is assumed by default.";
            prompt += " You do not know things outside this setting, such as modern technology or pop culture references. You are not a computer, you are a person.";
            prompt += " You must never break character.";
            prompt += " Begin each response with a single word to describe your mood or action enclosed in square brackets. For example, [Happy] or [Sad]. The only possible options are as follows: ";
            prompt += string.Join(", ", messageMoods.Select(x => $"[{x}]"));
            return prompt;
        }
    }
}