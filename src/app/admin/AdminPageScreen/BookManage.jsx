import Image from "next/image";

export default function BookManage() {

  const data = Array(12).fill({
    image: "/logo.png",
    title: "Engineering Mathematics",
    condition: "New",
    orginalPrice: 300,
    brandName: "Auth Name",
    discountPrice: 20,
    category: "Engineering",
  });

  return (
    <div className="w-full min-h-screen bg-gray-100 p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Book Management</h1>
        <p className="text-gray-500">Manage all books in your system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {["Total Books", "Engineering", "Medical", "Stationary"].map((item, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300"
          >
            <h2 className="text-gray-500 text-sm">{item}</h2>
            <p className="text-2xl font-bold text-blue-600 mt-2">20 Book</p>
          </div>
        ))}
      </div>

      {/* Book Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">

        {/* Table Header */}
        <div className="grid grid-cols-7 bg-gray-50 p-4 font-semibold text-gray-600 text-sm border-b">
          <div>Book</div>
          <div>Title</div>
          <div>Category</div>
          <div>Author</div>
          <div>Condition</div>
          <div>Price</div>
          <div>Discount %</div>
        </div>

        {/* Table Rows */}
        {data.map((book, index) => (
          <div
            key={index}
            className="grid grid-cols-7 items-center p-4 border-b hover:bg-gray-50 transition"
          >
            <div>
              <Image
                src={book.image}
                alt="book"
                width={50}
                height={50}
                className="rounded-lg object-cover"
              />
            </div>
            <div className="font-medium text-gray-700">{book.title}</div>
            <div className="text-gray-600 ml-4">{book.category}</div>
            <div className="text-gray-600">{book.brandName}</div>
            <div>
              <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                {book.condition}
              </span>
            </div>
            <div className="font-semibold text-gray-800">
              ₹ {book.orginalPrice}
            </div>
            <div className="text-red-500 font-semibold">
              {book.discountPrice}%
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
