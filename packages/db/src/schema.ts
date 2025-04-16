
import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  date,
  primaryKey,
  uniqueIndex,
  index,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- Core Product & Taxonomy Tables ---

const commonFields = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(), // Consider $onUpdate trigger or handle in application logic
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}


export const user = pgTable("user", {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  username: text('username').unique(),
  displayUsername: text('display_username'),
  role: text('role'),
  banned: boolean('banned'),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires')
});

export const session = pgTable("session", {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  impersonatedBy: text('impersonated_by')
});

export const account = pgTable("account", {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at')
});

export const brands = pgTable("brands", {
  brandId: serial("brand_id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  logoUrl: varchar("logo_url", { length: 512 }),
  description: text("description"),

  ...commonFields,
});

export const categories = pgTable(
  "categories",
  {
    categoryId: serial("category_id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    parentCategoryId: integer("parent_category_id"),
    description: text("description"),

    ...commonFields,
  },
  (table) => ([{
    parentCategoryIdx: index("parent_category_idx").on(table.parentCategoryId),
  }]),
);

export const products = pgTable(
  "products",
  {
    productId: serial("product_id").primaryKey(),
    brandId: integer("brand_id")
      .notNull()
      .references(() => brands.brandId),
    name: varchar("name", { length: 512 }).notNull(), // Increased length
    baseDescription: text("base_description"),
    overallRating: decimal("overall_rating", { precision: 3, scale: 2 }),
    totalReviews: integer("total_reviews").default(0).notNull(),
    totalQuestions: integer("total_questions").default(0).notNull(),
    dateFirstAvailable: date("date_first_available"),
    manufacturerWebsiteUrl: varchar("manufacturer_website_url", {
      length: 512,
    }),
    isuraVerified: boolean("isura_verified").default(false).notNull(),
    nonGmoDocumentation: boolean("non_gmo_documentation")
      .default(false)
      .notNull(),
    massSpecLabTested: boolean("mass_spec_lab_tested")
      .default(false)
      .notNull(),
    detailedDescription: text("detailed_description"),
    suggestedUse: text("suggested_use"),
    otherIngredients: text("other_ingredients"),
    warnings: text("warnings"),
    disclaimer: text("disclaimer"),
    ...commonFields
  },
  (table) => ([{
    brandIdx: index("product_brand_idx").on(table.brandId),
    nameIdx: index("product_name_idx").on(table.name), // Index for searching
  }]),
);

export const productCategories = pgTable(
  "product_categories",
  {
    productId: integer("product_id")
      .notNull()
      .references(() => products.productId, { onDelete: "cascade" }), // Cascade delete if product is removed
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.categoryId, { onDelete: "cascade" }), // Cascade delete if category is removed
  },
  (table) => ([{
    pk: primaryKey(table.productId, table.categoryId), // Composite primary key
  }]),
);

export const productVariants = pgTable(
  "product_variants",
  {
    variantId: serial("variant_id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.productId, { onDelete: "cascade" }),
    packageDescription: varchar("package_description", {
      length: 255,
    }).notNull(), // e.g., "90 Count"
    iHerbStockNumber: varchar("iherb_stock_number", { length: 50 }).unique(),
    upc: varchar("upc", { length: 50 }).unique(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull(), // e.g., "THB"
    listPrice: decimal("list_price", { precision: 10, scale: 2 }), // For showing discounts
    servingSize: varchar("serving_size", { length: 100 }),
    servingsPerContainer: integer("servings_per_container"),
    bestByDate: date("best_by_date"),
    isInStock: boolean("is_in_stock").default(true).notNull(),
    shippingWeightKg: decimal("shipping_weight_kg", {
      precision: 5,
      scale: 2,
    }),
    dimensionsCm: varchar("dimensions_cm", { length: 100 }),
    ...commonFields
  },
  (table) => ([{
    productIdx: index("variant_product_idx").on(table.productId),
    stockNumberIdx: index("variant_stock_number_idx").on(
      table.iHerbStockNumber,
    ),
  }]),
);

export const productImages = pgTable(
  "product_images",
  {
    imageId: serial("image_id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.productId, { onDelete: "cascade" }),
    imageUrl: varchar("image_url", { length: 1024 }).notNull(), // Longer length for URLs
    altText: varchar("alt_text", { length: 255 }),
    displayOrder: integer("display_order").default(0).notNull(),
    isThumbnail: boolean("is_thumbnail").default(false).notNull(),
    ...commonFields
  },
  (table) => ([{
    productIdx: index("image_product_idx").on(table.productId),
  }]),
);

export const supplementFacts = pgTable(
  "supplement_facts",
  {
    factId: serial("fact_id").primaryKey(),
    variantId: integer("variant_id")
      .notNull()
      .references(() => productVariants.variantId, { onDelete: "cascade" }),
    ingredientName: varchar("ingredient_name", { length: 255 }).notNull(),
    amountPerServing: varchar("amount_per_serving", {
      length: 100,
    }).notNull(),
    percentDailyValue: varchar("percent_daily_value", { length: 10 }), // To store strings like "**"
    displayOrder: integer("display_order").default(0).notNull(),
    ...commonFields
  },
  (table) => ([{
    variantIdx: index("supplement_variant_idx").on(table.variantId),
  }]),
);

export const productRankings = pgTable("product_rankings", {
  rankingId: serial("ranking_id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.productId, { onDelete: "cascade" }),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.categoryId, { onDelete: "cascade" }), // Link to category table
  categoryName: varchar("category_name", { length: 255 }).notNull(), // Denormalized for display
  rank: integer("rank").notNull(),
  dateRecorded: date("date_recorded").defaultNow().notNull(),
  ...commonFields
});

// --- User Interaction Tables ---


export const questions = pgTable(
  "questions",
  {
    questionId: serial("question_id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.productId, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }), // Link to your user table
    questionText: text("question_text").notNull(),
    questionDate: timestamp("question_date", { withTimezone: true })
      .defaultNow()
      .notNull(),
    upvotes: integer("upvotes").default(0).notNull(),
    downvotes: integer("downvotes").default(0).notNull(),
    ...commonFields
  },
  (table) => ([{
    productIdx: index("question_product_idx").on(table.productId),
    userIdx: index("question_user_idx").on(table.userId),
  }]),
);

export const answers = pgTable(
  "answers",
  {
    answerId: serial("answer_id").primaryKey(),
    questionId: integer("question_id")
      .notNull()
      .references(() => questions.questionId, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }), // Link to your user table
    answerText: text("answer_text").notNull(),
    answerDate: timestamp("answer_date", { withTimezone: true })
      .defaultNow()
      .notNull(),
    isBestAnswer: boolean("is_best_answer").default(false).notNull(),
    isVerifiedPurchase: boolean("is_verified_purchase")
      .default(false)
      .notNull(),
    isRewardedAnswer: boolean("is_rewarded_answer").default(false).notNull(),
    upvotes: integer("upvotes").default(0).notNull(),
    downvotes: integer("downvotes").default(0).notNull(),
    ...commonFields
  },
  (table) => ([{
    questionIdx: index("answer_question_idx").on(table.questionId),
    userIdx: index("answer_user_idx").on(table.userId),
  }]),
);

export const reviews = pgTable(
  "reviews",
  {
    reviewId: serial("review_id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.productId, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }), // Link to your user table
    rating: integer("rating").notNull(), // Consider adding a CHECK constraint (1-5) in SQL
    reviewTitle: varchar("review_title", { length: 255 }),
    reviewText: text("review_text"),
    reviewDate: timestamp("review_date", { withTimezone: true })
      .defaultNow()
      .notNull(),
    isVerifiedPurchase: boolean("is_verified_purchase")
      .default(false)
      .notNull(),
    isRewardedReview: boolean("is_rewarded_review").default(false).notNull(),
    helpfulVotes: integer("helpful_votes").default(0).notNull(),
    notHelpfulVotes: integer("not_helpful_votes").default(0).notNull(),
    reviewerLocation: varchar("reviewer_location", { length: 100 }),
    ...commonFields
  },
  (table) => ([{
    productIdx: index("review_product_idx").on(table.productId),
    userIdx: index("review_user_idx").on(table.userId),
    ratingIdx: index("review_rating_idx").on(table.rating),
  }]),
);

export const reviewImages = pgTable(
  "review_images",
  {
    reviewImageId: serial("review_image_id").primaryKey(),
    reviewId: integer("review_id")
      .notNull()
      .references(() => reviews.reviewId, { onDelete: "cascade" }),
    imageUrl: varchar("image_url", { length: 1024 }).notNull(),
    altText: varchar("alt_text", { length: 255 }),
    ...commonFields
  },
  (table) => ([{
    reviewIdx: index("review_image_review_idx").on(table.reviewId),
  }]),
);

export const reviewHighlights = pgTable("review_highlights", {
  highlightId: serial("highlight_id").primaryKey(),
  highlightText: varchar("highlight_text", { length: 100 }).notNull().unique(),
  iconClass: varchar("icon_class", { length: 50 }), // Optional: for UI icons
});

export const productReviewHighlights = pgTable(
  "product_review_highlights",
  {
    productId: integer("product_id")
      .notNull()
      .references(() => products.productId, { onDelete: "cascade" }),
    highlightId: integer("highlight_id")
      .notNull()
      .references(() => reviewHighlights.highlightId, { onDelete: "cascade" }),
    ...commonFields
  },
  (table) => ([{
    pk: primaryKey(table.productId, table.highlightId),
  }]),
);

// --- Related Products Tables ---

export const frequentlyBoughtTogetherGroups = pgTable(
  "frequently_bought_together_groups",
  {
    groupId: serial("group_id").primaryKey(),
    description: varchar("description", { length: 255 }), // Optional description
  },
);

export const frequentlyBoughtTogetherItems = pgTable(
  "frequently_bought_together_items",
  {
    groupId: integer("group_id")
      .notNull()
      .references(() => frequentlyBoughtTogetherGroups.groupId, {
        onDelete: "cascade",
      }),
    variantId: integer("variant_id")
      .notNull()
      .references(() => productVariants.variantId, { onDelete: "cascade" }),
    displayOrder: integer("display_order").default(0).notNull(),
    ...commonFields
  },
  (table) => ([{
    pk: primaryKey(table.groupId, table.variantId),
    variantIdx: index("fbti_variant_idx").on(table.variantId), // Index if querying by variant
  }]),
);

export const customersAlsoViewed = pgTable(
  "customers_also_viewed",
  {
    relationshipId: serial("relationship_id").primaryKey(),
    sourceVariantId: integer("source_variant_id")
      .notNull()
      .references(() => productVariants.variantId, { onDelete: "cascade" }),
    viewedVariantId: integer("viewed_variant_id")
      .notNull()
      .references(() => productVariants.variantId, { onDelete: "cascade" }),
    viewCount: integer("view_count").default(1).notNull(),
    ...commonFields
  },
  (table) => ([{
    // Unique constraint to avoid duplicate pairs
    sourceViewedUnique: uniqueIndex("cav_source_viewed_idx").on(
      table.sourceVariantId,
      table.viewedVariantId,
    ),
    sourceVariantIdx: index("cav_source_variant_idx").on(
      table.sourceVariantId,
    ), // Index for querying by source
  }]),
);

// --- Drizzle Relations ---
// Define relationships for ORM querying (e.g., joins, eager loading)

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parentCategory: one(categories, {
    fields: [categories.parentCategoryId],
    references: [categories.categoryId],
    relationName: "parentCategory",
  }),
  childCategories: many(categories, {
    relationName: "parentCategory",
  }),
  productCategories: many(productCategories),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.brandId],
  }),
  productCategories: many(productCategories),
  productVariants: many(productVariants),
  productImages: many(productImages),
  productRankings: many(productRankings),
  questions: many(questions),
  reviews: many(reviews),
  productReviewHighlights: many(productReviewHighlights),
}));

export const productCategoriesRelations = relations(
  productCategories,
  ({ one }) => ({
    product: one(products, {
      fields: [productCategories.productId],
      references: [products.productId],
    }),
    category: one(categories, {
      fields: [productCategories.categoryId],
      references: [categories.categoryId],
    }),
  }),
);

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.productId],
    }),
    supplementFacts: many(supplementFacts),
    frequentlyBoughtTogetherItems: many(frequentlyBoughtTogetherItems),
    customersAlsoViewedSource: many(customersAlsoViewed, {
      relationName: "sourceVariant",
    }),
    customersAlsoViewedTarget: many(customersAlsoViewed, {
      relationName: "viewedVariant",
    }),
  }),
);

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.productId],
  }),
}));

export const supplementFactsRelations = relations(
  supplementFacts,
  ({ one }) => ({
    productVariant: one(productVariants, {
      fields: [supplementFacts.variantId],
      references: [productVariants.variantId],
    }),
  }),
);

export const productRankingsRelations = relations(
  productRankings,
  ({ one }) => ({
    product: one(products, {
      fields: [productRankings.productId],
      references: [products.productId],
    }),
    category: one(categories, {
      fields: [productRankings.categoryId],
      references: [categories.categoryId],
    }),
  }),
);

export const usersRelations = relations(user, ({ many }) => ({
  questions: many(questions),
  answers: many(answers),
  reviews: many(reviews),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  product: one(products, {
    fields: [questions.productId],
    references: [products.productId],
  }),
  user: one(user, {
    fields: [questions.userId],
    references: [user.id],
  }),
  answers: many(answers),
}));

export const answersRelations = relations(answers, ({ one }) => ({
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.questionId],
  }),
  user: one(user, {
    fields: [answers.userId],
    references: [user.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.productId],
  }),
  user: one(user, {
    fields: [reviews.userId],
    references: [user.id],
  }),
  reviewImages: many(reviewImages),
}));

export const reviewImagesRelations = relations(reviewImages, ({ one }) => ({
  review: one(reviews, {
    fields: [reviewImages.reviewId],
    references: [reviews.reviewId],
  }),
}));

export const reviewHighlightsRelations = relations(
  reviewHighlights,
  ({ many }) => ({
    productReviewHighlights: many(productReviewHighlights),
  }),
);

export const productReviewHighlightsRelations = relations(
  productReviewHighlights,
  ({ one }) => ({
    product: one(products, {
      fields: [productReviewHighlights.productId],
      references: [products.productId],
    }),
    reviewHighlight: one(reviewHighlights, {
      fields: [productReviewHighlights.highlightId],
      references: [reviewHighlights.highlightId],
    }),
  }),
);

export const frequentlyBoughtTogetherGroupsRelations = relations(
  frequentlyBoughtTogetherGroups,
  ({ many }) => ({
    items: many(frequentlyBoughtTogetherItems),
  }),
);

export const frequentlyBoughtTogetherItemsRelations = relations(
  frequentlyBoughtTogetherItems,
  ({ one }) => ({
    group: one(frequentlyBoughtTogetherGroups, {
      fields: [frequentlyBoughtTogetherItems.groupId],
      references: [frequentlyBoughtTogetherGroups.groupId],
    }),
    productVariant: one(productVariants, {
      fields: [frequentlyBoughtTogetherItems.variantId],
      references: [productVariants.variantId],
    }),
  }),
);

export const customersAlsoViewedRelations = relations(
  customersAlsoViewed,
  ({ one }) => ({
    sourceVariant: one(productVariants, {
      fields: [customersAlsoViewed.sourceVariantId],
      references: [productVariants.variantId],
      relationName: "sourceVariant",
    }),
    viewedVariant: one(productVariants, {
      fields: [customersAlsoViewed.viewedVariantId],
      references: [productVariants.variantId],
      relationName: "viewedVariant",
    }),
  }),
);
