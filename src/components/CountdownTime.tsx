"use client"

import React from "react"

interface CountdownTimerState {
  hours: number
  minutes: number
  seconds: number
}

class CountdownTimer extends React.Component<object, CountdownTimerState> {
  private timer: NodeJS.Timeout | null = null

  constructor(props: object) {
    super(props)
    this.state = {
      hours: 0,
      minutes: 10,
      seconds: 44,
    }
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState((prevState) => {
        let { hours, minutes, seconds } = prevState
        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        } else {
          // Hết giờ
          if (this.timer) clearInterval(this.timer)
        }

        return { hours, minutes, seconds }
      })
    }, 1000)
  }

  componentWillUnmount() {
    if (this.timer) clearInterval(this.timer)
  }

  formatTime = (num: number): string => String(num).padStart(2, "0")

  render() {
    const { hours, minutes, seconds } = this.state

    return (
      <div className="flex items-center justify-center md:justify-start gap-1 mb-4">
        <span className="text-sm">Bắt đầu sau:</span>
        <div className="flex items-center gap-1">
          <span className="bg-amber-50 text-rose-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
            {this.formatTime(hours)}
          </span>
          <span>:</span>
          <span className="bg-amber-50 text-rose-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
            {this.formatTime(minutes)}
          </span>
          <span>:</span>
          <span className="bg-amber-50 text-rose-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
            {this.formatTime(seconds)}
          </span>
        </div>
      </div>
    )
  }
}

export default CountdownTimer
