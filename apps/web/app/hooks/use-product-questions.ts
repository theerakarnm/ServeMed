import { useState, useEffect } from "react"

export function useQuestions(productId: number) {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [questions, setQuestions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchQuestions() {
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/products/${productId}/questions`)
        // const data = await response.json()

        // Mock data for demonstration
        const mockQuestions = [
          {
            questionId: 1,
            productId,
            userId: "user1",
            userName: "HealthEnthusiast",
            questionText: "Is this product suitable for vegetarians?",
            questionDate: "2023-05-15T10:30:00Z",
            upvotes: 12,
            downvotes: 1,
            answers: [
              {
                answerId: 101,
                questionId: 1,
                userId: "admin1",
                userName: "ServeMed Support",
                answerText: "Yes, this product is suitable for vegetarians. It contains no animal-derived ingredients.",
                answerDate: "2023-05-16T09:15:00Z",
                isBestAnswer: true,
                isVerifiedPurchase: false,
                isRewardedAnswer: false,
                upvotes: 8,
                downvotes: 0
              },
              {
                answerId: 102,
                questionId: 1,
                userId: "user2",
                userName: "VitaminLover",
                answerText: "I'm vegetarian and have been using it for months with no issues.",
                answerDate: "2023-05-17T14:22:00Z",
                isBestAnswer: false,
                isVerifiedPurchase: true,
                isRewardedAnswer: false,
                upvotes: 5,
                downvotes: 0
              }
            ]
          },
          {
            questionId: 2,
            productId,
            userId: "user3",
            userName: "NutritionSeeker",
            questionText: "How long does one bottle typically last?",
            questionDate: "2023-06-02T16:45:00Z",
            upvotes: 8,
            downvotes: 0,
            answers: [
              {
                answerId: 201,
                questionId: 2,
                userId: "admin1",
                userName: "ServeMed Support",
                answerText: "The 60 capsule bottle will last 2 months if taken as directed (1 capsule per day).",
                answerDate: "2023-06-03T10:30:00Z",
                isBestAnswer: true,
                isVerifiedPurchase: false,
                isRewardedAnswer: false,
                upvotes: 6,
                downvotes: 0
              }
            ]
          },
          {
            questionId: 3,
            productId,
            userId: "user4",
            userName: "WellnessJourney",
            questionText: "Does this need to be taken with food or can it be taken on an empty stomach?",
            questionDate: "2023-06-10T08:15:00Z",
            upvotes: 15,
            downvotes: 0,
            answers: [
              {
                answerId: 301,
                questionId: 3,
                userId: "user5",
                userName: "HealthPro",
                answerText: "I take mine with breakfast. The manufacturer recommends taking it with a meal for best absorption.",
                answerDate: "2023-06-10T12:45:00Z",
                isBestAnswer: false,
                isVerifiedPurchase: true,
                isRewardedAnswer: false,
                upvotes: 10,
                downvotes: 1
              },
              {
                answerId: 302,
                questionId: 3,
                userId: "admin1",
                userName: "ServeMed Support",
                answerText: "For optimal absorption, we recommend taking this supplement with a meal containing some fat.",
                answerDate: "2023-06-11T09:30:00Z",
                isBestAnswer: true,
                isVerifiedPurchase: false,
                isRewardedAnswer: false,
                upvotes: 12,
                downvotes: 0
              }
            ]
          }
        ]

        setQuestions(mockQuestions)
      } catch (error) {
        console.error("Error fetching questions:", error)
        setQuestions([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestions()
  }, [productId])

  return { questions, isLoading }
}
