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
    public class ReviewController : ApiController
    {
        private ModelDBContext db = new ModelDBContext();

        // GET: api/Review
        public IQueryable<Review> GetReview()
        {
            return db.Review;
        }

        // GET: api/Review/5
        [ResponseType(typeof(Review))]
        public async Task<IHttpActionResult> GetReview(long id)
        {
            Review review = await db.Review.FindAsync(id);
            if (review == null)
            {
                return NotFound();
            }

            return Ok(review);
        }

        [HttpGet]
        [Route("api/Review/ByEvent/{eventId}")]
        public IHttpActionResult GetReviewByEvent(long eventId)
        {
            var reviews = db.Review
                .Where(r => r.IdEvent == eventId)
                .Select(r => new
                 {
                    IdReview = r.IdReview,
                    Comment = r.Comment,
                    IdUser = r.IdUser,
                    IdEvent = r.IdEvent,
                    IdAttendance = r.IdAttendance
                }).ToList();
            return Ok(reviews);
        }

        // PUT: api/Review/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutReview(long id, Review review)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != review.IdReview)
            {
                return BadRequest();
            }

            db.Entry(review).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReviewExists(id))
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

        // POST: api/Review
        [ResponseType(typeof(Review))]
        public async Task<IHttpActionResult> PostReview(Review review)
        {

            db.Review.Add(review);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = review.IdReview }, review);
        }

        // DELETE: api/Review/5
        [ResponseType(typeof(Review))]
        public async Task<IHttpActionResult> DeleteReview(long id)
        {
            Review review = await db.Review.FindAsync(id);
            if (review == null)
            {
                return NotFound();
            }

            db.Review.Remove(review);
            await db.SaveChangesAsync();

            return Ok(review);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ReviewExists(long id)
        {
            return db.Review.Count(e => e.IdReview == id) > 0;
        }
    }
}