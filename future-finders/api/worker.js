const ALLOWED_ORIGIN = "https://darksword89.github.io";
const MAX_IDEA_LENGTH = 2000;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin"
    }
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    if (origin !== ALLOWED_ORIGIN) return json({ error: "Origin not allowed." }, 403);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
          "Vary": "Origin"
        }
      });
    }
    if (request.method !== "POST") return json({ error: "Use POST." }, 405);

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Please send a valid form." }, 400);
    }

    // Honeypot: bots often fill this hidden field. Respond generically without sending.
    if (typeof body.website === "string" && body.website.trim()) return json({ ok: true });
    const firstName = typeof body.firstName === "string" ? body.firstName.trim().slice(0, 40) : "";
    const idea = typeof body.idea === "string" ? body.idea.trim() : "";
    const problemType = typeof body.problemType === "string" ? body.problemType : "";
    const generalLocation = typeof body.generalLocation === "string" ? body.generalLocation.trim().slice(0, 120) : "";
    const allowedTypes = new Set(["home", "school", "public", "online", "other"]);

    if (!idea || idea.length > MAX_IDEA_LENGTH || !allowedTypes.has(problemType)) {
      return json({ error: "Please add an idea and choose where the problem happens." }, 400);
    }
    if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL || !env.IDEA_RECIPIENT_EMAIL) {
      return json({ error: "The secure email service is not fully configured yet." }, 503);
    }

    const labels = {
      home: "At someone's home",
      school: "At school",
      public: "In a public place",
      online: "Online",
      other: "Somewhere else"
    };
    const text = [
      "A new Future Finders idea was submitted.",
      "",
      "First name: " + (firstName || "Not provided"),
      "Problem happens: " + labels[problemType],
      "General location: " + (generalLocation || "Not provided"),
      "",
      "Idea:",
      idea,
      "",
      "Privacy reminder: please handle this submission carefully and do not forward personal information unnecessarily."
    ].join("\n");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + env.RESEND_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: env.RESEND_FROM_EMAIL,
        to: [env.IDEA_RECIPIENT_EMAIL],
        subject: "New Future Finders idea",
        text
      })
    });

    if (!response.ok) {
      // Do not return provider details or secrets to the browser.
      return json({ error: "The email could not be sent. Please try again later." }, 502);
    }
    return json({ ok: true });
  }
};
