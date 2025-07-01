import { Request, Response } from "express";
import Practice from "@models/Practice";
import StateDescriptions from "@models/StateDescriptions";
import User from "@models/User";
import { MailgunService } from "@services/mailgun";
import { VALIDATE_STATES } from "@constants/index";

export class PracticeController {
  GetPracticeList = async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 25, search = "", state = "" } = req.body;
      const parsedPage = parseInt(page);
      const validLimits = [25, 50, 100];
      const parsedLimit = parseInt(limit);

      if (!validLimits.includes(parsedLimit))
        return res.status(400).json({
          status: 400,
          message: "Invalid limit. Must be 25, 50, or 100.",
        });

      const filter: any = {};
      if (state || search) {
        filter.$or = [];
        if (state) {
          filter.$or.push(
            { state: { $regex: state, $options: "i" } },
            { name: { $regex: state, $options: "i" } },
            { city: { $regex: state, $options: "i" } },
            { type: { $regex: state, $options: "i" } }
          );
        }
        if (search) {
          filter.$or.push(
            { state: { $regex: search, $options: "i" } },
            { name: { $regex: search, $options: "i" } },
            { city: { $regex: search, $options: "i" } },
            { type: { $regex: search, $options: "i" } }
          );
        }
      }

      const totalCount = await Practice.countDocuments(filter);
      const skip = (parsedPage - 1) * parsedLimit;
      const listings: any = await Practice.find(filter)
        .skip(skip)
        .limit(parsedLimit);

      const formattedListings = listings.map((listing: any) => ({
        _id: listing._id,
        id: listing.id,
        name: listing.name,
        state: listing.state,
        city: listing.city,
        type: listing.type,
        operatory: listing.operatory,
        annual_collections: listing.annual_collections,
      }));

      return res.status(200).json({
        status: true,
        payload: {
          data: formattedListings,
          totalCount,
          currentPage: parsedPage,
          totalPages: Math.ceil(totalCount / parsedLimit),
        },
      });
    } catch (error) {
      return res.status(500).json({
        statu: false,
        message: "Server error, please try again later.",
      });
    }
  };

  GetPracticeById = async (req: Request, res: Response) => {
    try {
      const { role } = req.body;
      const { id } = req.params;
      const practice: any = await Practice.findById(id);

      if (!practice) {
        return res.status(404).json({
          status: false,
          message: "Practice not found.",
        });
      }

      let payload: any = {
        _id: practice._id,
        id: practice.id,
        name: practice.name,
        city: practice.city,
        details: practice.details,
        state: practice.state,
        price: practice.price,
        type: practice.type,
        operatory: practice.operatory,
        square_ft: practice.square_ft,
        annual_collections: practice.annual_collections,
        content: practice.content,
      };

      if (role === "ADMIN") {
        payload["admin_content"] = practice.admin_content;
        payload["origin"] = practice.origin;
        payload["source_link"] = practice.source_link;
      }

      return res.status(200).json({
        status: true,
        payload: {
          practice: payload,
        },
        message: "Practice Detail Fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        statu: false,
        message: "Server error, please try again later.",
      });
    }
  };

  LikePractice = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      const user: any = await User.findById(userId);

      if (!user) {
        return res
          .status(404)
          .json({ status: false, error: "User not found." });
      }

      const practice: any = await Practice.findById(id);

      if (!practice) {
        return res
          .status(404)
          .json({ status: false, error: "Practice not found." });
      }

      const updatedResult: any = await User.findByIdAndUpdate(userId, {
        $addToSet: { likes: id },
      });

      let message = "";
      if (updatedResult.modifiedCount === 0) {
        await User.findByIdAndUpdate(userId, { $pull: { likes: id } });
        message = "Practice removed from likes.";
      } else {
        message = "Practice added to likes.";

        const mailgunService = new MailgunService();
        mailgunService.sendEmail(
          process.env.ADMIN_EMAIL || "",
          "New Listing Like",
          `<p>User ${user.firstName} ${user.lastName} (${user.email}) has liked the listing: ${practice.name} (ID: ${practice.id}) [${process.env.DOMAIN}/listings/${id}]</p>`
        );
        mailgunService.sendEmail(
          user.email,
          "You Liked a Listing",
          `<p>You have successfully liked the listing: ${practice.name} (${process.env.DOMAIN}/listings/${id})</p>`
        );
      }

      return res.status(200).json({
        status: true,
        message: message,
      });
    } catch (err) {
      return res.status(500).json({
        statu: false,
        message: "Server error, please try again later.",
      });
    }
  };

  GetLocalAreas = async (req: Request, res: Response) => {
    try {
      const { state } = req.body;
      if (!state || typeof state !== "string" || state.trim() === "") {
        return res
          .status(400)
          .json({ status: false, message: "Invalid or missing state name." });
      }

      const areas = await Practice.aggregate([
        { $match: { state: state.trim() } },
        { $group: { _id: "$city" } },
        { $project: { _id: 0, city: "$_id" } },
      ]);

      if (areas.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No local areas found for the specified state.",
        });
      }

      return res.status(200).json({
        status: true,
        payload: {
          areas: areas
            .filter((area) => area.city !== "")
            .map((area) => area.city),
        },
      });
    } catch (err) {
      return res.status(500).json({
        statu: false,
        message: "Server error, please try again later.",
      });
    }
  };

  GetStatesListingCount = async (req: Request, res: Response) => {
    try {
      let results = [];
      let funcs: any = [];
      for (let s of VALIDATE_STATES) {
        let filter = {
          $or: [
            { state: { $regex: s, $options: "i" } },
            { name: { $regex: s, $options: "i" } },
            { city: { $regex: s, $options: "i" } },
            { type: { $regex: s, $options: "i" } },
          ],
        };
        results.push({ query: s, count: 0 });
        funcs.push(Practice.countDocuments(filter));
      }
      const counts = await Promise.all(funcs);
      counts.forEach((count: number, index: number) => {
        results[index].count = count;
      });

      return res.status(200).json({
        status: true,
        payload: {
          data: results,
        },
      });
    } catch (err) {
      return res.status(500).json({
        statu: false,
        message: "Server error, please try again later.",
      });
    }
  };

  GetStateListingsCount = async (req: Request, res: Response) => {
    try {
      const { state } = req.body;
      if (!state || typeof state !== "string" || state.trim() === "") {
        return res
          .status(400)
          .json({ status: false, message: "Invalid or missing state name." });
      }

      const filter = {
        $or: [
          { state: { $regex: state, $options: "i" } },
          { name: { $regex: state, $options: "i" } },
          { city: { $regex: state, $options: "i" } },
          { type: { $regex: state, $options: "i" } },
        ],
      };

      const count = await Practice.countDocuments(filter);
      return res.status(200).json({
        status: true,
        payload: {
          query: state.trim(),
          count,
        },
      });
    } catch (err) {
      return res.status(500).json({
        statu: false,
        message: "Server error, please try again later.",
      });
    }
  };

  GetLikedListings = async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      const user: any = await User.findById(userId)
        .populate({
          path: "likes",
          select: {
            state: 1,
            name: 1,
            id: 1,
            operatory: 1,
            type: 1,
            annual_collections: 1,
          },
        })
        .select({ likes: 1 });

      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found." });
      }

      const existingLikes = user.likes.map((like: any) => like._id);
      await User.updateOne(
        { _id: userId },
        { $pull: { likes: { $nin: existingLikes } } }
      );

      return res.status(200).json({
        status: true,
        payload: {
          likes: user.likes,
        },
      });
    } catch (err) {
      return res.status(500).json({
        statu: false,
        message: "Server error, please try again later.",
      });
    }
  };

  GetLikedListingsByUserId = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user: any = await User.findById(id)
        .populate({
          path: "likes",
          select: {
            state: 1,
            name: 1,
            id: 1,
            operatory: 1,
            type: 1,
            annual_collections: 1,
          },
        })
        .select({ likes: 1 });

      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found." });
      }

      const existingLikes = user.likes.map((like: any) => like._id);
      await User.updateOne(
        { _id: id },
        { $pull: { likes: { $nin: existingLikes } } }
      );

      return res.status(200).json({
        status: true,
        payload: {
          likes: user.likes,
        },
      });
    } catch (err) {
      return res.status(500).json({
        statu: false,
        message: "Server error, please try again later.",
      });
    }
  };

  GetStateDescription = async (req: Request, res: Response) => {
    try {
      const { state } = req.body;
      if (!state || typeof state !== "string" || state.trim() === "") {
        return res.status(400).json({
          status: false,
          message: "Invalid or missing state name."
        });
      }

      // Search for state descriptions matching the state name (case insensitive)
      const stateDescriptions = await StateDescriptions.find({
        state: { $regex: `^${state}$`, $options: "i" }
      });
      if (!stateDescriptions || stateDescriptions.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No state descriptions found for the given state."
        });
      }

      return res.status(200).json({
        status: true,
        payload: stateDescriptions
      });
    } catch (err) {
      console.error('Error fetching state description:', err);
      return res.status(500).json({
        status: false,
        message: "Server error, please try again later."
      });
    }
  };
}
