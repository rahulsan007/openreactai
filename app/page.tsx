"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PaperclipIcon, SendHorizontal } from "lucide-react"

const examples = ["Quiz app", "SaaS Landing page", "Pomodoro Timer", "Blog app", "Flashcard app", "Timezone dashboard"]

export default function Home() {
  const [message, setMessage] = useState("")

  const handleExampleClick = (example: string) => {
    setMessage(`Build me a ${example.toLowerCase()}...`)
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="w-full max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-7xl font-medium text-[#3f3f46] aeonik-r">
            Turn your <span className="text-[#326df5]">idea</span> <br /> into an <span className="text-[#326df5]">app</span>
          </h1>
        </div>

        <div className="space-y-4">
          <div className="relative border-4 border-[#D4D4D8] rounded-lg overflow-hidden">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Build me a budgeting app..."
              className="w-full min-h-[120px] p-4 pb-16 focus:outline-none resize-none"
            />
            <div className="absolute left-0 right-0 bottom-0 flex items-center gap-2 p-2 bg-white text-[#18181bc9]">
              <Select defaultValue="qwen">
                <SelectTrigger className="w-[180px] bg-white border-none shadow-none">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="qwen">Qwen 2.5 Coder 32B</SelectItem>
                </SelectContent>
              </Select>

              <span className="text-gray-400">|</span>

              <Select defaultValue="high">
                <SelectTrigger className="w-[180px] bg-white border-none shadow-none">
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High quality [slower]</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" className="bg-white ml-auto">
                <PaperclipIcon className="h-4 w-4" />
              </Button>

              <Button size="icon" className="bg-blue-500 hover:bg-blue-600">
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {examples.map((example) => (
              <Button
                key={example}
                variant="secondary"
                className="bg-gray-100 hover:bg-gray-200 text-gray-900"
                onClick={() => handleExampleClick(example)}
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
