'use client'

import Image from 'next/image'
import {
	Shuffle,
	SkipBack,
	Play,
	SkipForward,
	Repeat,
	Volume,
	Star,
} from 'lucide-react'
import Link from 'next/link'

export const Player = () => {
	return (
		<div className="bg-foreground/3 p-2.5 text-foreground fixed z-50 rounded-sm h-22.5 bottom-2.5 left-2.5 right-2.5">
			<div className="flex items-center justify-between h-full">
				<div className="w-[30%]">
					<div className="flex items-center gap-3">
						<div className="relative h-[60px] w-[60px]">
							<Image
								src="/salam.png"
								alt="Лоботомия"
								fill
								className="rounded-sm"
							/>
						</div>
						<div className="flex flex-col">
							<Link
								href="/"
								className="font-bold text-foreground text-sm hover:underline"
							>
								Лоботомия
							</Link>
							<Link
								href="/"
								className="font-medium text-xs text-foreground/50 hover:underline"
							>
								FENDIGLOCK
							</Link>
						</div>
					</div>
				</div>

				<div className="w-[40%] flex flex-col items-center gap-2">
					<div className="flex items-center gap-10">
						<button className="text-foreground/50 hover:text-foreground">
							<Repeat size={20} strokeWidth={1} />
						</button>
						<div className="flex gap-5">
							<button className="hover:text-foreground/80">
								<SkipBack fill="currentColor" size={20} strokeWidth={1} />
							</button>
							<button className="bg-foreground text-background rounded-full p-2 ">
								<Play fill="currentColor" size={25} strokeWidth={1} />
							</button>
							<button className="hover:text-foreground/80">
								<SkipForward fill="currentColor" size={20} strokeWidth={1} />
							</button>
						</div>
						<button className="text-foreground/50 hover:text-foreground">
							<Shuffle size={20} strokeWidth={1} />
						</button>
					</div>
					<div className="flex items-center gap-2 w-full">
						<span className="text-xs text-foreground/50">0:57</span>
						<div className="h-1 bg-foreground/25 rounded-full flex-grow group">
							<div
								className="bg-foreground h-1 rounded-full relative"
								style={{ width: '30%' }}
							>
								<div className="w-3 h-3 bg-foreground rounded-full absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
							</div>
						</div>
						<span className="text-xs text-neutral-400">-1:26</span>
					</div>
				</div>

				<div className="w-[30%] flex justify-end items-center gap-4">
					<div className="flex items-center gap-2">
						<button className="hover:text-foreground/50">
							<Star size={20} strokeWidth={1} />
						</button>
						<button className="hover:text-foreground/50">
							<Volume size={25} strokeWidth={1} />
						</button>
						<div className="h-1 bg-foreground/25 rounded-full w-24 group">
							<div
								className="bg-foreground h-1 rounded-full relative"
								style={{ width: `75%` }}
							>
								<div className="w-3 h-3 bg-foreground rounded-full absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
