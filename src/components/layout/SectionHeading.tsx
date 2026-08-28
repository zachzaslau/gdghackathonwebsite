interface SectionHeadingProps {
  children: string
}

export function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <h2 className="font-heading mb-4 text-xl font-bold text-wii-blue-800 sm:text-2xl">
      {children}
    </h2>
  )
}
