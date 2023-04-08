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
    public class LocationController : Controller
    {
        private readonly ILogger<LocationController> _logger;
        private IConfiguration _configuration;
        private static readonly Random r = new Random();

        public LocationController(ILogger<LocationController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        [HttpGet(Name = "GetLocationName")]
        public async Task<IActionResult> ShortDescription(string key)
        {
            if(key != _configuration["userKey"])
                return BadRequest("Invalid API Key");

            string house = BuildHouse();

            return Json(
                new { 
                    Response = house,
                    prompt = ""
                }
            );
        }

        [HttpGet(Name = "GetLocationDescriptions")]
        public async Task<IActionResult> LongDescription(string key, string shortDesc)
        {
            if(key != _configuration["userKey"])
                return BadRequest("Invalid API Key");

            string house = System.Net.WebUtility.UrlDecode(shortDesc);
            var request = new ChatRequest("gpt-3.5-turbo", 
                new ChatMessage[] { 
                    new ChatMessage("user", "Describe the following house in a short paragraph: " + house) 
                }
            );
            ChatResponse? resonse = await Utils.GetGPTResponseAsync(request, _configuration["OpenAIKey"]);
            if(resonse != null){
                return Json(
                    new { 
                        Response = resonse.Choices[0].Message.Content,
                        prompt = house
                    }
                );
            }
            return BadRequest("OpenAI API returned an error");  

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
            "ornate",
            "rustic",
            "rusty",
            "weathered",
            "weather-beaten",
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
            "Yellow sandstone",
            "brick and mortar",
            "brick and stone",
            "brick and wood",
            "Timber-framed",

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
            "residence",
            "villa",
            "barn",
            "barracks",
            "guildhall",
            "farmhouse",
            "hall",
            "inn",
            "church",
        };

        private static string[] houseSingleFeatures = new string[] {
            "roof",
            "garden",
            "porch",
            "veranda",
            "planter box",
            "entrance",
            "hall",
            "thatched roof",
            "chimney",
            "fireplace",
        };

        private static string[] houseMultipleFeatures = new string[] {
            "windows",
            "eves",
            "doors",
            "fittings",
            "terracotta roof tiles",

        };

        private static string[] houseLife = new string[] {
            "smoke rising from the chimney",
            "lit windows",
            "illuminated windows",
            "arrow-slit windows",
            "stained-glass windows",
            "a doorbell",
            "a door knocker",
            "door ajar",
            "wooden beams",
            "fortified gates",
            "a gatehouse",
            "a drawbridge",
            "wrought-iron railings"
        };
    }
}
