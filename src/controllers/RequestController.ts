// server/controllers/requestInterest.controller.ts
import { Request, Response } from "express";
import { MailgunService } from "@services/mailgun";

export class RequestInterestController {
  RequestInterest = async (req: Request, res: Response) => {
    try {
      const { user = {}, practice = {}, choices = [] } = req.body ?? {};

      // Basic validation
      if (!Array.isArray(choices) || choices.length === 0) {
        return res.status(400).json({ status: false, message: "At least one option must be selected." });
      }

      const adminEmail = process.env.ADMIN_EMAIL;
      if (!adminEmail) {
        console.error("ADMIN_EMAIL not configured");
        return res.status(500).json({ status: false, message: "Server email configuration missing." });
      }

      // Build HTML body: choices each on own line, blank line, user info, blank line, ID/name/url
      const choicesHtml = choices.map((c: string) => `<div>${escapeHtml(c)}</div>`).join("");
      const userFullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

      const bodyHtml = `
        <div>
          ${choicesHtml}
          <br/>
          <div>${escapeHtml(userFullName)}</div>
          <div>${escapeHtml(user.email ?? "")}</div>
          <div>${escapeHtml(user.phone ?? "")}</div>
          <br/>
          <div>ID ${escapeHtml(String(practice.id ?? ""))}</div>
          <div>${escapeHtml(practice.name ?? "")}</div>
          <div><a href="${escapeHref(practice.url ?? "")}">${escapeHtml(practice.url ?? "")}</a></div>
        </div>
      `;

      const subject = `New Listing Interest - ID ${practice.id ?? ""} - ${practice.name ?? ""}`;

      const mailgunService = new MailgunService();
      await mailgunService.sendEmail(adminEmail, subject, bodyHtml);

      return res.status(200).json({
        status: true,
        message: "Email sent",
      });
    } catch (error) {
      console.error("request-interest error:", error);
      return res.status(500).json({
        statu: false,
        message: "Server error, please try again later.",
      });
    }
  };
}

/* ---------- helpers ---------- */
// Basic HTML escaping to prevent injection. Not a full sanitizer but sufficient for these small fields.
function escapeHtml(unsafe: string) {
  return String(unsafe ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeHref(unsafe: string) {
  const s = String(unsafe ?? "").trim();
  // block javascript: hrefs
  if (/^\s*javascript:/i.test(s)) return "#";
  return escapeHtml(s);
}
