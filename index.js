const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();

// 2. Parameters:
//    - Implement the following parameters in the API:
//      - `currentPage`: Current page number.
//      - `pageSize`: Number of items per page.
//      - `orderBy`: Field to order the results by.
//      - `orderDir`: Order direction (ascending/descending).
//      - `searchBy`: Field name for searching.
//      - `searchFields`: Array of column names to be searched.

// - `pageSize`: 10
// - `currentPage`: 1
// - `orderBy`: 'createdAt'
// - `orderDir`: 'desc'
// - `searchBy`:""
// - `searchFields`:[]

// admin
// DB Pass - <replace-with-password>

// Host : <replace-with-host>
// Port : 3306
const sequelize = new Sequelize(
    "conqtvms_dev",
    "admin",
    "<replace-with-password>",
    {
        host: "<replace-with-host>",
        dialect: "mysql",
        port: 3306,
    }
);

// const Products = sequelize.define(
//     "Products",
//     {
//         productId: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             primaryKey: true,
//         },
//         productName: {
//             type: DataTypes.STRING,
//         },
//         description: {
//             type: DataTypes.STRING,
//         },
//         price: {
//             type: DataTypes.DOUBLE,
//         },
//         currency: {
//             type: DataTypes.STRING,
//         },
//         category: {
//             type: DataTypes.INTEGER,
//         },
//         subCategory: {
//             type: DataTypes.INTEGER,
//         },
//         promoCode: {
//             type: DataTypes.STRING,
//         },
//         productType: {
//             type: DataTypes.STRING,
//         },
//         images: {
//             type: DataTypes.STRING,
//         },
//         imagesUrl: {
//             type: DataTypes.STRING,
//         },
//         moreDetail
//     },
//     {
//         // Other model options go here
//     }
// );

// -`productId` -
//     `productName` -
//     `productImageName` -
//     `productImageURL` -
//     `brandName` -
//     `description` -
//     `itemCode` -
//     `itemType` -
//     `currency` -
//     `currencyCode` -
//     `saleAmount` -
//     `brochureFileName` -
//     `brochureFileURL` -
//     `vendors` -
//     `status` -
//     `createdBy` -
//     `created` -
//     `updated` -
//     `subCategoryId` -
//     `categoryId` -
//     `uomId` -
//     `shippingMethodId` -
//     `shippingTermsId` -
//     `paymentTermsId` -
//     `categoryName` -
//     `subCategoryName` -
//     `uomCode` -
//     `uomDescription` -
//     `organisationName` -
//     `organisationId` -
//     `vendorInfo`;

app.get("/", async (req, res) => {
    try {
        const {
            currentPage = 1,
            pageSize = 10,
            orderBy = "createdAt",
            orderDir = "desc",
            searchBy = "",
            searchFields = [],
        } = req.query;

        const searchFieldText = searchFields.join(`like %${searchBy}% OR `);

        const [count, _meta] = await sequelize.query(
            `select count(*) as count from Products`
        );

        const totalCount = count[0]["count"];

        const [results, _metadata] = await sequelize.query(
            `select * from Products ${
                searchFieldText
                    ? `where ${searchFieldText} like %${searchBy}%`
                    : ``
            } order by "createdAt" DESC  limit ${pageSize} offset ${
                (currentPage - 1) * pageSize
            } 
            `
        );
        console.log(`select * from Products ${
            searchFieldText ? `where ${searchFieldText}` : ``
        }
        order by ${orderBy} ${orderDir}
        limit ${pageSize}
        offset ${(currentPage - 1) * pageSize}
        `);

        return res.json({
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: Math.ceil(totalCount / pageSize),
            totalCount: totalCount,
            data: results,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            internal: "error",
        });
    }
});

app.listen(3000);
