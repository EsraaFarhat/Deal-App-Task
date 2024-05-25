import UsersService from "../services/users.service.mjs";
import { handlePaginationSort } from "../utils/helpers.mjs";
import { UserStatus } from "../shared/enums.mjs";

export default class UsersController {
/**
 * Retrieves statistics for active users, including the number of ads and requests they have,
 * as well as the total amount for ads and requests. The results are paginated and sorted.
 *
 * @param {Object} req - The request object containing the query parameters.
 * @param {Object} res - The response object to send the statistics.
 * @return {Promise<void>} - A promise that resolves when the statistics are sent.
 */
  static async getStatistics(req, res) {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const { skip, limit, sort } = handlePaginationSort(req.query);
    
    const pipeline = [
      // Match active users
      { $match: { status: UserStatus.ACTIVE } },

      // Project necessary fields
      { $project: { name: 1, role: 1, phoneNumber: 1, createdAt: 1 } },
      { $sort: sort },

      // Lookup ads count and total amount for all users
      {
        $lookup: {
          from: "ads",
          localField: "_id",
          foreignField: "userId",
          as: "ads",
        },
      },
      {
        $addFields: {
          adsCount: { $size: "$ads" },
          totalAdsAmount: { $sum: "$ads.price" },
        },
      },

      // Lookup requests count and total amount for all users
      {
        $lookup: {
          from: "propertyrequests",
          localField: "_id",
          foreignField: "userId",
          as: "propertyRequests",
        },
      },
      {
        $addFields: {
          requestsCount: { $size: "$propertyRequests" },
          totalRequestsAmount: { $sum: "$propertyRequests.price" },
        },
      },

      // Project required fields
      {
        $project: {
          _id: 1,
          name: 1,
          role: 1,
          phoneNumber: 1,
          adsCount: 1,
          totalAdsAmount: 1,
          requestsCount: 1,
          totalRequestsAmount: 1,
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]
    const users = await UsersService.aggregate(pipeline);

    // Count total documents
    const total = await UsersService.count({ status: UserStatus.ACTIVE});

    // Calculate total pages and pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = pageNumber < totalPages;
    const hasPreviousPage = pageNumber > 1;

    res.send({
      data: { rows: users },
      page: pageNumber,
      limit,
      total,
      hasNextPage,
      hasPreviousPage,
    });
  }
}
