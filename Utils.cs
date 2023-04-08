using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DnDAPI.Extensions;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using DnDAPI.Controllers;

namespace DnDAPI{
    public static class Utils{
        private static HttpClient client = new HttpClient();
        static Utils(){
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }
        public static async Task<ChatResponse?> GetGPTResponseAsync(ChatRequest request, string key){
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", key);
            var response = await client.PostAsJsonAsync("https://api.openai.com/v1/chat/completions", request);
            if(response.StatusCode == System.Net.HttpStatusCode.OK){
                string content = await response.Content.ReadAsStringAsync() ?? "";
                return JsonConvert.DeserializeObject<ChatResponse>(content);
            }
            return null;
        }
    }
}