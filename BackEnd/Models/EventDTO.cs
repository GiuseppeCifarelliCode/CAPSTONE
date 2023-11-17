using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EvenMT.Models
{
    public class EventDTO
    {
        public long IdEvent { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int IdCategory { get; set; }
        public string Place { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Link { get; set; }
        public string Cover { get; set; }
        public string Img { get; set; }
        public string BackGround { get; set; }
        public bool Free { get; set; }
        public decimal? TicketPrice { get; set; }
    }
}