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
    public record ChatRequest(string Model, ChatMessage[] Messages);
    public record ChatMessage(string Role, string Content);
    public record ChatResponse(string Id, string Model, ChatChoice[] Choices);
    public record ChatChoice(ChatMessage Message, int Index);
}