using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using EvenMT.Models;

namespace EvenMT.Controllers
{
    public class AttendanceController : ApiController
    {
        private ModelDBContext db = new ModelDBContext();

        // GET: api/Attendance
        public IQueryable<Attendance> GetAttendance()
        {
            return db.Attendance;
        }

        // GET: api/Attendance/5
        [ResponseType(typeof(Attendance))]
        public async Task<IHttpActionResult> GetAttendance(long id)
        {
            Attendance attendance = await db.Attendance.FindAsync(id);
            if (attendance == null)
            {
                return NotFound();
            }

            return Ok(attendance);
        }

        [HttpGet]
        [Route("api/Attendance/User/{userId}")]
        public IHttpActionResult GetUserAttendance(long userId)
        {
            var userAttendances = db.Attendance
                .Where(a => a.IdUser == userId)
                .Select(p => new
                {
                    IdAttendance = p.IdAttendance,
                    Partecipated = p.Partecipated,
                    Rating = p.Rating,
                    Ticket = p.Ticket,
                    Favourite = p.Favourite,
                    IdUser = p.IdUser,
                    IdEvent = p.IdEvent,
                })
                .ToList();

            return Ok(userAttendances);
        }

        [HttpGet]
        [Route("api/Attendance/UserWithTicket/{userId}")]
        public IHttpActionResult GetUserAttendanceWithTicket(long userId)
        {
            var userAttendancesWithTicket = db.Attendance
                .Where(a => a.IdUser == userId && a.Ticket == true)
                .Select(p => new
                {
                    IdAttendance = p.IdAttendance,
                    Partecipated = p.Partecipated,
                    Rating = p.Rating,
                    Ticket = p.Ticket,
                    Favourite = p.Favourite,
                    IdUser = p.IdUser,
                    IdEvent = p.IdEvent,
                })
                .ToList();

            return Ok(userAttendancesWithTicket);
        }

        // PUT: api/Attendance/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutAttendance(long id, Attendance attendance)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != attendance.IdAttendance)
            {
                return BadRequest();
            }

            db.Entry(attendance).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AttendanceExists(id))
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

        // POST: api/Attendance
        [ResponseType(typeof(Attendance))]
        public async Task<IHttpActionResult> PostAttendance(Attendance attendance)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Attendance.Add(attendance);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = attendance.IdAttendance }, attendance);
        }

        // DELETE: api/Attendance/5
        [ResponseType(typeof(Attendance))]
        public async Task<IHttpActionResult> DeleteAttendance(long id)
        {
            Attendance attendance = await db.Attendance.FindAsync(id);
            if (attendance == null)
            {
                return NotFound();
            }

            db.Attendance.Remove(attendance);
            await db.SaveChangesAsync();

            return Ok(attendance);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool AttendanceExists(long id)
        {
            return db.Attendance.Count(e => e.IdAttendance == id) > 0;
        }
    }
}