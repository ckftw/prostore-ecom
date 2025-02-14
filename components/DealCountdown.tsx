/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

//STATIC TARGET DATE
const TARGET_DATE = new Date('2025-04-10T00:00:00');

//FUNCTION TO CALCULATE TIME REMAINING
const calculateTimeRemaining = (targetDate: Date) => {
    const currentTime = new Date();
    const timeDifference = Math.max(Number(targetDate) - Number(currentTime), 0)
    return {
        days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
            (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor(
            (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
        ),
        seconds: Math.floor(
            (timeDifference % (1000 * 60)) / (1000)
        ),
    }
}

const DealCountdown = () => {
    const [time, setTime] = useState<ReturnType<typeof calculateTimeRemaining>>();
    useEffect(() => {
        setTime(calculateTimeRemaining(TARGET_DATE));
        const timerInterval = setInterval(() => {
            const newTime = calculateTimeRemaining(TARGET_DATE);
            setTime(newTime)
            if (newTime.days == 0 && newTime.hours == 0 && newTime.minutes == 0 && newTime.seconds == 0) {
                clearInterval(timerInterval)
            }
        }, 1000)

        return () => {
            clearInterval(timerInterval)
        }
    }, [])

    if (!time) return (
        <section className="grid grid-cols-1 md:grid-cols-2 my-20">
            <div className="flex flex-col gap-2 justify-center">
                <h3 className="text-3xl font-bold">Loading Countdown</h3>
            </div>
        </section>
    )
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 my-20">
            <div className="flex flex-col gap-2 justify-center">
                <h3 className="text-3xl font-bold">Deal Of The Month</h3>
                <p>
                    Get ready for a shopping experience like never before with our deals of the month!
                    Every purchase comes with exclusive perks and offers.
                </p>
                <ul className="grid grid-cols-4">
                    <StatBox label="Days" value={time.days} />
                    <StatBox label="Hours" value={time.hours} />
                    <StatBox label="Minutes" value={time.minutes} />
                    <StatBox label="Seconds" value={time.seconds} />
                </ul>
                <div className="text-center">
                    <Button asChild>
                        <Link href={'/search'}>View Products</Link>
                    </Button>
                </div>
            </div>
            <div className="flex justify-center">
                <Image width={300} height={200} src={'/images/promo.jpg'} alt="promotion" />
            </div>
        </section>
    )
}

const StatBox = ({ label, value }: { label: string; value: number }) => {
    return (
        <li className="p-4 w-full text-center">
            <p className="text-3xl font-bold">{value}</p>
            <p>{label}</p>
        </li>
    )
}
export default DealCountdown