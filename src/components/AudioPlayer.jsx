export default function AudioPlayer({ src }) {
  return (
    <audio controls className="w-full">
      <source src={src} type="audio/mpeg" />
    </audio>
  )
}
