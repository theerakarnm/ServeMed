import { useState } from "react"
import { ChevronUp, ChevronDown, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import { Card, CardContent, CardFooter, CardHeader } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import { useQuestions } from "~/hooks/use-product-questions"
import { formatDistanceToNow } from "date-fns"
import { toast } from 'sonner';

interface ProductQuestionsProps {
  productId: number
}

export default function ProductQuestions({ productId }: ProductQuestionsProps) {
  const { questions, isLoading } = useQuestions(productId)
  const [newQuestion, setNewQuestion] = useState("")
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({})

  const toggleQuestion = (questionId: number) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }))
  }

  const handleSubmitQuestion = () => {
    if (!newQuestion.trim()) {
      toast("Question cannot be empty")
      return
    }

    // In a real app, this would submit to the server
    toast("Your question has been submitted for review.")
    setNewQuestion("")
  }

  const handleVote = (type: 'upvote' | 'downvote', questionId: number) => {
    // In a real app, this would submit to the server
    toast(`Your ${type} has been recorded.`)
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading questions...</div>
  }

  return (
    <div className="space-y-8">
      {/* Ask a Question */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Ask a Question</h2>
        <div className="space-y-4">
          <Textarea
            placeholder="Have a question about this product? Ask here..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end">
            <Button onClick={handleSubmitQuestion}>Submit Question</Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Questions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Customer Questions</h2>
          <span className="text-sm text-muted-foreground">{questions.length} questions</span>
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No questions yet. Be the first to ask a question!
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <Card key={question.questionId}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{question.userName || "Anonymous"}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(question.questionDate), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleVote('upvote', question.questionId)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span className="sr-only">Upvote</span>
                      </Button>
                      <span className="text-xs">{question.upvotes}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleVote('downvote', question.questionId)}
                      >
                        <ThumbsDown className="h-4 w-4" />
                        <span className="sr-only">Downvote</span>
                      </Button>
                      <span className="text-xs">{question.downvotes}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="font-medium">{question.questionText}</p>
                </CardContent>
                <CardFooter className="flex-col items-start pt-0">
                  {question.answers && question.answers.length > 0 && (
                    <div className="w-full">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 mb-2"
                        onClick={() => toggleQuestion(question.questionId)}
                      >
                        {expandedQuestions[question.questionId] ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            Hide {question.answers.length} {question.answers.length === 1 ? 'answer' : 'answers'}
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4" />
                            Show {question.answers.length} {question.answers.length === 1 ? 'answer' : 'answers'}
                          </>
                        )}
                      </Button>

                      {expandedQuestions[question.questionId] && (
                        <div className="space-y-3 mt-2 pl-4 border-l">
                          {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                          {question.answers.map((answer: any) => (
                            <div key={answer.answerId} className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{answer.userName || "Anonymous"}</span>
                                {answer.isVerifiedPurchase && (
                                  <Badge variant="outline" className="text-xs">Verified Purchase</Badge>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(answer.answerDate), { addSuffix: true })}
                                </span>
                              </div>
                              <p>{answer.answerText}</p>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleVote('upvote', answer.answerId)}
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                  <span className="sr-only">Upvote</span>
                                </Button>
                                <span className="text-xs">{answer.upvotes}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleVote('downvote', answer.answerId)}
                                >
                                  <ThumbsDown className="h-3 w-3" />
                                  <span className="sr-only">Downvote</span>
                                </Button>
                                <span className="text-xs">{answer.downvotes}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
