using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EvenMT.Models
{
    public class UserDTO
    {
        public long IdUser { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string BirthPlace { get; set; }
        public DateTime BirthDate { get; set; }
        public string Avatar { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public bool Privacy { get; set; }
        public string Role { get; set; }
    }
}