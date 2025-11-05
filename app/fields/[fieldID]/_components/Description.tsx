export const Description = ({ description }: { description: string }) => {
  return (
    <>
      <div>
        <h2 className="text-lg font-bold mb-2">Sobre la cancha</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </>
  )
}
