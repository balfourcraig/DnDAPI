using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DnDAPI.Extensions;
using System.Net.Http.Headers;
using Newtonsoft.Json;

namespace DnDAPI.Controllers{
    public record ChatRequest(ChatMessage[] Messages, string Model = "gpt-3.5-turbo");
    public record ChatMessage(string Role, string Content);
    public record ChatResponse(string Id, string Model, ChatChoice[] Choices);
    public record ChatChoice(ChatMessage Message, int Index);

    public record DALLEImageRequest(string Prompt, string Size = "256x256");
    public record DALLEImageResponse(int created, DALLEImage[] Data);
    public record DALLEImage(string Url);

    public class NPC{
        public string Firstname {get; set;}
        public string Lastname {get; set;}
        public string Gender {get; set;}
        public string Voice {get; set;}
        public string[] Clothing {get; set;}
        public string[] Loot {get; set;}
        public string Action {get; set;}
        public string Flavor {get; set;}
        public string Secret {get; set;}
        public string House {get; set;}
        public string? Description  {get; set;} = null;
        public string? ImageURL  {get; set;} = null;
    }
}