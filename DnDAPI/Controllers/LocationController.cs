using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DnDAPI.Extensions;

namespace DnDAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationController : ControllerBase
    {
        private readonly ILogger<LocationController> _logger;
        private static readonly Random r = new Random();

        public LocationController(ILogger<LocationController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetLocationName")]
        public string Get()
        {
            return BuildHouse();
        }

        public static string BuildHouse(){
            string h = "";
            h += houseDescriptions.Random().Capitalize().AddArticle() + " ";
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
