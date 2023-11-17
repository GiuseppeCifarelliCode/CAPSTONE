namespace EvenMT.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Attendance",
                c => new
                    {
                        IdAttendance = c.Long(nullable: false, identity: true),
                        Partecipated = c.Boolean(nullable: false),
                        Rating = c.Int(),
                        Ticket = c.Boolean(),
                        Favourite = c.Boolean(),
                        IdUser = c.Long(nullable: false),
                        IdEvent = c.Long(nullable: false),
                    })
                .PrimaryKey(t => t.IdAttendance)
                .ForeignKey("dbo.Event", t => t.IdEvent)
                .ForeignKey("dbo.User", t => t.IdUser)
                .Index(t => t.IdUser)
                .Index(t => t.IdEvent);
            
            CreateTable(
                "dbo.Event",
                c => new
                    {
                        IdEvent = c.Long(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        Description = c.String(nullable: false),
                        IdCategory = c.Int(nullable: false),
                        Place = c.String(nullable: false),
                        StartDate = c.DateTime(nullable: false),
                        EndDate = c.DateTime(),
                        Link = c.String(),
                        Cover = c.String(nullable: false),
                        Img = c.String(),
                        BackGround = c.String(),
                        Free = c.Boolean(nullable: false),
                        TicketPrice = c.Decimal(storeType: "money"),
                    })
                .PrimaryKey(t => t.IdEvent)
                .ForeignKey("dbo.Category", t => t.IdCategory)
                .Index(t => t.IdCategory);
            
            CreateTable(
                "dbo.Category",
                c => new
                    {
                        IdCategory = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 50),
                    })
                .PrimaryKey(t => t.IdCategory);
            
            CreateTable(
                "dbo.Review",
                c => new
                    {
                        IdReview = c.Long(nullable: false, identity: true),
                        Comment = c.String(nullable: false),
                        IdUser = c.Long(nullable: false),
                        IdEvent = c.Long(nullable: false),
                        IdAttendance = c.Long(nullable: false),
                    })
                .PrimaryKey(t => t.IdReview)
                .ForeignKey("dbo.User", t => t.IdUser)
                .ForeignKey("dbo.Event", t => t.IdEvent)
                .ForeignKey("dbo.Attendance", t => t.IdAttendance)
                .Index(t => t.IdUser)
                .Index(t => t.IdEvent)
                .Index(t => t.IdAttendance);
            
            CreateTable(
                "dbo.User",
                c => new
                    {
                        IdUser = c.Long(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 50),
                        Surname = c.String(nullable: false, maxLength: 50),
                        BirthPlace = c.String(nullable: false),
                        BirthDate = c.DateTime(nullable: false, storeType: "date"),
                        Avatar = c.String(),
                        Username = c.String(nullable: false),
                        Email = c.String(nullable: false),
                        Phone = c.String(maxLength: 50),
                        Password = c.String(nullable: false),
                        Privacy = c.Boolean(nullable: false),
                        Role = c.String(nullable: false, maxLength: 50),
                    })
                .PrimaryKey(t => t.IdUser);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Review", "IdAttendance", "dbo.Attendance");
            DropForeignKey("dbo.Review", "IdEvent", "dbo.Event");
            DropForeignKey("dbo.Review", "IdUser", "dbo.User");
            DropForeignKey("dbo.Attendance", "IdUser", "dbo.User");
            DropForeignKey("dbo.Event", "IdCategory", "dbo.Category");
            DropForeignKey("dbo.Attendance", "IdEvent", "dbo.Event");
            DropIndex("dbo.Review", new[] { "IdAttendance" });
            DropIndex("dbo.Review", new[] { "IdEvent" });
            DropIndex("dbo.Review", new[] { "IdUser" });
            DropIndex("dbo.Event", new[] { "IdCategory" });
            DropIndex("dbo.Attendance", new[] { "IdEvent" });
            DropIndex("dbo.Attendance", new[] { "IdUser" });
            DropTable("dbo.User");
            DropTable("dbo.Review");
            DropTable("dbo.Category");
            DropTable("dbo.Event");
            DropTable("dbo.Attendance");
        }
    }
}
