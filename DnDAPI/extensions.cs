using System;
using System.Linq;
using System.Runtime.CompilerServices;

namespace DnDAPI.Extensions
{
    public static class ArrayExtensions{
        private static readonly Random Shared = new Random();
        public static T Random<T>(this T[] array)
        {
            return array[Shared.Next(array.Length)];
        }
    }

    public static class StringExtensions
    {
//capitalize
        public static string Capitalize(this string s)
        {
            return s[0].ToString().ToUpperInvariant() + s[1..];
        }

        //add article
        public static string AddArticle(this string s)
        {
            if (s.IsVowel())
            {
                return "an " + s;
            }
            else
            {
                return "a " + s;
            }
        }


        public static bool IsVowel(this string s)
        {
            return s.ToUpperInvariant()[0] switch
            {
                'A' => true,
                'E' => true,
                'I' => true,
                'O' => true,
                'U' => true,
                _ => false,
            };
        }
    }
}