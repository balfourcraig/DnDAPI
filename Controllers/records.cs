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
        public string Firstname {get; set;} = string.Empty;
        public string Lastname {get; set;} = string.Empty;
        public string Gender {get; set;} = string.Empty;
        public string Voice {get; set;} = string.Empty;
        public string Clothing {get; set;} = string.Empty;
        public string Loot {get; set;} = string.Empty;
        public string Action {get; set;} = string.Empty;
        public string Flavor {get; set;} = string.Empty;
        public string Secret {get; set;} = string.Empty;
        public string House {get; set;} = string.Empty;
        public string? Description  {get; set;} = null;
        public string? ImageURL  {get; set;} = null;
        public string? ImagePrompt { get; set; } = null;
        public string? Race { get; set; } = null;
        public string? Profession { get; set; } = null;
        public string? Location { get; set; } = null;
        public List<KeyValuePair<string, string>>? Extras { get; set; } = null;
    }

    public record NPCChatRequest(ChatMessage[] Messages, NPC Person);

    public class Quest{
        public string Title { get; set; } = string.Empty;
        public string Mission { get; set; } = string.Empty;
        public string? Description { get; set; } = null;
        public string Hook { get; set; } = string.Empty;
        public string Antagonist { get; set; } = string.Empty;
        public string Ally { get; set; } = string.Empty;
        public string Complication { get; set; } = string.Empty;
        public string Obstacle { get; set; } = string.Empty;
        public string Twist { get; set; } = string.Empty;
        public string Reward { get; set; } = string.Empty;
        public string? Theme { get; set; } = null;
    }
}