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
    public class LocationController : Controller
    {
        private readonly ILogger<LocationController> _logger;
        private IConfiguration _configuration;
        private static readonly Random r = new Random();

        public record ChatRequest(string Model, ChatMessage[] Messages);
        public record ChatMessage(string Role, string Content);
        public record ChatResponse(string Id, string Model, ChatChoice[] Choices);
        public record ChatChoice(ChatMessage Message, int Index);

        public LocationController(ILogger<LocationController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        [HttpGet(Name = "GetLocationName")]
        public async Task<IActionResult> Get()
        {
            string house = BuildHouse();
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _configuration["OpenAIKey"]);
            var request = new ChatRequest("gpt-3.5-turbo", 
                new ChatMessage[] { 
                    new ChatMessage("user", "Describe the following house in a short paragraph: " + house) 
                }
            );
            try{
                var response = await client.PostAsJsonAsync("https://api.openai.com/v1/chat/completions", request);
                if(response.StatusCode == System.Net.HttpStatusCode.OK){
                    string content = await response.Content.ReadAsStringAsync() ?? "";
                    ChatResponse result = JsonConvert.DeserializeObject<ChatResponse>(content);
                    return Json(
                        new { 
                            Response = result.Choices[0].Message.Content,
                            prompt = house
                        }
                    );
                }
                return BadRequest("OpenAI API returned " + response.StatusCode.ToString());  
            }
            catch(Exception _){
                return BadRequest("Error calling API");
            }
        }

        public static string BuildHouse(){
            string h = "";
            h += houseDescriptions.Random().AddArticle().Capitalize() + " ";
            if(r.NextDouble() < 0.2){
                h += houseMaterials.Random() + " ";
            }
            h += houseTypes.Random();
            double featureIndex = r.NextDouble();
            if(featureIndex < 0.3){
                h += " with ";
                string desc = houseDescriptions.Random();
                while(h.Contains(desc))
                    desc = houseDescriptions.Random();
                h += desc.AddArticle() + " ";
                h += houseSingleFeatures.Random();
            }
            else if(featureIndex < 0.6){
                h += " with ";
                string desc = houseDescriptions.Random();
                while(h.Contains(desc))
                    desc = houseDescriptions.Random();
                h += desc + " ";
                h += houseMultipleFeatures.Random();
            }
            else if(featureIndex < 0.75){
                h += " with ";
                h += houseLife.Random();
            }
            return h + ".";
        }

        private static string[] houseDescriptions = new string[] {
            "large",
            "small",
            "crumbling",
            "stately",
            "squat",
            "tall",
            "tidy",
            "dirty",
            "faded",
            "fresh",
            "painted",
            "aged",
            "old",
            "overgrown",
            "moss-covered",
            "well kept",
            "detailed",
            "decorative",
        };

        private static string[] houseMaterials = new string[] {
            "brick",
            "wooden",
            "stone",
            "clay brick",
            "boarded",
            "tiled",
            "draughty",
            "red brick",
            "wood board",
            "mud brick",
            "adobe",
        };

        private static string[] houseTypes = new string[] {
            "house",
            "hovel",
            "shack",
            "home",
            "manor",
            "shed",
            "building",
            "apartment",
            "dwelling",
            "mansion",
            "cave",
            "shanty",
            "tent",
            "cabin",
            "cottage",
            "farm",
            "hut",
            "place",
            "shelter",
            "bungalow",
            "homestead",
            "lodge",
        };

        private static string[] houseSingleFeatures = new string[] {
            "roof",
            "garden",
            "porch",
            "veranda",
            "planter box",
            "entrance",
            "hall",
        };

        private static string[] houseMultipleFeatures = new string[] {
            "windows",
            "eves",
            "doors",
            "fittings",
        };

        private static string[] houseLife = new string[] {
            "smoke rising from the chimney",
            "lit windows",
        };
    }
}
