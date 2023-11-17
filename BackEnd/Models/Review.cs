namespace EvenMT.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Review")]
    public partial class Review
    {
        [Key]
        public long IdReview { get; set; }

        [Required]
        public string Comment { get; set; }

        public long IdUser { get; set; }

        public long IdEvent { get; set; }

        public long IdAttendance { get; set; }

        public virtual Attendance Attendance { get; set; }

        public virtual Event Event { get; set; }

        public virtual User User { get; set; }
    }
}
