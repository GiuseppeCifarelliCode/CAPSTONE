using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using EvenMT.Models;

namespace EvenMT.Controllers
{
    public class EventController : ApiController
    {
        private ModelDBContext db = new ModelDBContext();

        // GET: api/Event
        public IHttpActionResult GetEvent()
        {
            // Eseguire una proiezione per ottenere un elenco di oggetti anonimi
            var events = db.Event
                .Select(e => new
                {
                    e.IdEvent,
                    e.Name,
                    e.Description,
                    e.IdCategory,
                    e.Place,
                    e.StartDate,
                    e.EndDate,
                    e.Link,
                    e.Cover,
                    e.Img,
                    e.BackGround,
                    e.Free,
                    e.TicketPrice
                })
                .ToList();

            return Ok(events);
        }

        // GET: api/Event/5
        [ResponseType(typeof(Event))]
        public async Task<IHttpActionResult> GetEvent(long id)
        {
            var @event = await db.Event
            .Where(e => e.IdEvent == id)
            .Select(e => new EventDTO
            {
             IdEvent = e.IdEvent,
             Name = e.Name,
             Description = e.Description,
             IdCategory = e.IdCategory,
             Place = e.Place,
             StartDate = e.StartDate,
             EndDate = e.EndDate,
             Link = e.Link,
             Cover = e.Cover,
             Img = e.Img,
             BackGround = e.BackGround,
             Free = e.Free,
             TicketPrice = e.TicketPrice
         })
         .FirstOrDefaultAsync();

            if (@event == null)
            {
                return NotFound();
            }

            return Ok(@event);
        }

        [HttpGet]
        [Route("api/Event/GetEventsByDate")]
        public IHttpActionResult GetEventsByDate(DateTime date)
        {
            // Esegui una query per ottenere gli eventi in base alla data
            var eventsByDate = db.Event
                .AsEnumerable()
                .Where(e => e.StartDate.Date == date.Date)
                .Select(e => new
                {
                    e.IdEvent,
                    e.Name,
                    e.Description,
                    e.IdCategory,
                    e.Place,
                    e.StartDate,
                    e.EndDate,
                    e.Link,
                    e.Cover,
                    e.Img,
                    e.BackGround,
                    e.Free,
                    e.TicketPrice
                })
                .ToList();

            return Ok(eventsByDate);
        }

        [HttpGet]
        [Route("api/Event/GetNextEvents")]
        public IHttpActionResult GetNextEvents()
        {
            // Esegui una query per ottenere gli eventi in base alla data
            DateTime nextDate = DateTime.Now;
            var nextEvents = db.Event
                .AsEnumerable()
                .Where(e => e.StartDate.Date > nextDate)
                .Select(e => new
                {
                    e.IdEvent,
                    e.Name,
                    e.Description,
                    e.IdCategory,
                    e.Place,
                    e.StartDate,
                    e.EndDate,
                    e.Link,
                    e.Cover,
                    e.Img,
                    e.BackGround,
                    e.Free,
                    e.TicketPrice
                })
                .ToList();

            return Ok(nextEvents);
        }

        [HttpGet]
        [Route("api/Event/GetEventsByCategory")]
        public IHttpActionResult GetEventsByCategory(int IdCategory)
        {
            // Esegui una query per ottenere gli eventi in base alla data
            var eventsByCategory = db.Event
                .Where(e => e.IdCategory == IdCategory)
                .Select(e => new
                {
                    e.IdEvent,
                    e.Name,
                    e.Description,
                    e.IdCategory,
                    e.Place,
                    e.StartDate,
                    e.EndDate,
                    e.Link,
                    e.Cover,
                    e.Img,
                    e.BackGround,
                    e.Free,
                    e.TicketPrice
                })
                .ToList();

            return Ok(eventsByCategory);
        }


        // PUT: api/Event/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutEvent(long id, Event @event)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != @event.IdEvent)
            {
                return BadRequest();
            }

            db.Entry(@event).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Event
        [ResponseType(typeof(Event))]
        public async Task<IHttpActionResult> PostEvent(Event @event)
        {
            try
            {
                string coverFileName = Guid.NewGuid().ToString();
                string imgFileName = Guid.NewGuid().ToString();
                string backgroundFileName = Guid.NewGuid().ToString();

                string coverData = @event.Cover;
                string imgData = @event.Img;
                string backgroundData = @event.BackGround;

                byte[] coverBytes = Convert.FromBase64String(coverData);
                byte[] imgBytes = Convert.FromBase64String(imgData);
                byte[] backgroundBytes = Convert.FromBase64String(backgroundData);

                // Percorsi completi per i file nelle cartelle "assets"
                string basePhysicalPath = HttpContext.Current.Server.MapPath("~/Content/assets");
                string coverFilePath = Path.Combine(basePhysicalPath, coverFileName);
                string imgFilePath = Path.Combine(basePhysicalPath, imgFileName);
                string backgroundFilePath = Path.Combine(basePhysicalPath, backgroundFileName);

                File.WriteAllBytes(coverFilePath, coverBytes);
                File.WriteAllBytes(imgFilePath, imgBytes);
                File.WriteAllBytes(backgroundFilePath, backgroundBytes);

                // Salva i percorsi delle immagini nel tuo modello
                @event.Cover = coverFileName;
                @event.Img = imgFileName;
                @event.BackGround = backgroundFileName;
            }
            
            catch (Exception ex)
            {
                return BadRequest("Error while saving the file: " + ex.Message);
            }

            db.Event.Add(@event);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = @event.IdEvent }, @event);
        }

        // DELETE: api/Event/5
        [ResponseType(typeof(Event))]
        public async Task<IHttpActionResult> DeleteEvent(long id)
        {
            Event @event = await db.Event.FindAsync(id);
            if (@event == null)
            {
                return NotFound();
            }

            db.Event.Remove(@event);
            await db.SaveChangesAsync();

            return Ok(@event);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EventExists(long id)
        {
            return db.Event.Count(e => e.IdEvent == id) > 0;
        }

        [HttpGet]
        [Route("api/Event/image/{filename}")]
        public IHttpActionResult GetImage(string filename)
        {
            string imagePath = Path.Combine(HttpContext.Current.Server.MapPath("~/Content/assets"), filename);

            if (File.Exists(imagePath))
            {
                // Leggi il file come array di byte
                byte[] fileBytes = File.ReadAllBytes(imagePath);

                // Restituisci il file come una risposta HTTP
                string base64String = Convert.ToBase64String(fileBytes);
                var imageResponse = new { base64Image = base64String };

                return Ok(imageResponse);
            }
            else
            {
                return NotFound(); // Gestisci il caso in cui il file non esista
            }
        }
    }
}