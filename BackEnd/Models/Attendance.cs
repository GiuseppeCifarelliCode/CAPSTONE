namespace EvenMT.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Attendance")]
    public partial class Attendance
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Attendance()
        {
            Review = new HashSet<Review>();
        }

        [Key]
        public long IdAttendance { get; set; }

        public bool Partecipated { get; set; }

        public int? Rating { get; set; }

        public bool? Ticket { get; set; }

        public bool? Favourite { get; set; }

        public long IdUser { get; set; }

        public long IdEvent { get; set; }

        public virtual Event Event { get; set; }

        public virtual User User { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Review> Review { get; set; }
    }
}
