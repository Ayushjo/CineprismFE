import PostImageUploader from "@/components/admin/PostImageUploader";

export default function UploadReviewPosterPage() {
  return (
    <PostImageUploader
      title="Upload Review Poster"
      description="Set the horizontal backdrop shown on featured/related cards."
      endpoint="/admin/add-review-poster"
      fileField="file"
    />
  );
}
