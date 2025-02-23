"use client";
import { Camera, Shirt, Ruler } from "lucide-react";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TypographyH1 } from "@/components/typography/H1";
import { TypographyH2 } from "@/components/typography/H2";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 overflow-hidden">
      <div className="relative w-full">
        <div className="container px-4 flex flex-col items-center text-center gap-6 relative z-10">
          <TypographyH1>Your Perfect Fit Virtual Wardrobe</TypographyH1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          >
            Try on clothes virtually and get your perfect size with AI-powered
            precision
          </motion.p>

          <button className="p-[3px] relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
            <div className="px-8 py-2 bg-background rounded-[6px] relative group transition duration-200 hover:bg-transparent">
              <Link href="/sign-in">Try FitSnap Now</Link>
            </div>
          </button>
        </div>
      </div>

      <section className="w-full py-8">
        <div className="container px-4 ">
          <div className="flex items-center justify-center">
            <TypographyH2>See How It Works</TypographyH2>
          </div>
          <Carousel className="w-full max-w-xs mx-auto sm:max-w-sm md:max-w-md mt-4">
            <CarouselContent>
              {[1, 2, 3].map((_, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <div className="flex aspect-[9/16] items-center justify-center rounded-xl bg-primary/10 relative overflow-hidden">
                      <img
                        src={`/placeholder.svg?height=640&width=360&text=App Screenshot ${
                          index + 1
                        }`}
                        alt={`App Screenshot ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12">
        <div className="container px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="group relative rounded-xl border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Camera className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold">Snap Your Photo</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Take a quick photo to get started with virtual try-on
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="group relative rounded-xl border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Ruler className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold">Get Your Size</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                AI measures your exact size across different brands
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="group relative rounded-xl border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Shirt className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold">Try Clothes On</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Virtually try on clothes and see how they fit
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="w-full py-8">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto rounded-xl border bg-card p-8 text-card-foreground text-center"
          >
            <h2 className="text-2xl font-bold">
              Ready to find your perfect fit?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Join thousands of happy customers who found their perfect size
            </p>
            <button className="p-[3px] relative mt-6">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
              <div className="px-8 py-2 bg-background rounded-[6px] relative group transition duration-200 hover:bg-transparent">
                Get Started Free
              </div>
            </button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
