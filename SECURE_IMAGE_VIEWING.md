# Secure Image Viewing Implementation

This implementation provides secure image viewing using AWS S3 signed URLs instead of making objects public.

## Backend Implementation

### 1. S3 Signed URL Service (`backend/src/common/s3-signed-url.ts`)
- Generates temporary signed URLs for S3 objects
- URLs expire in 1 hour for security
- Requires AWS credentials and bucket configuration

### 2. File Controller (`backend/src/file/file.controller.ts`)
- Provides `/files/signed-url?key=<file-key>` endpoint
- Protected with JWT authentication
- Returns signed URL with expiration info

### 3. File Module (`backend/src/file/file.module.ts`)
- Registers the file controller
- Added to main app module

## Frontend Implementation

### 1. Image Modal (`admin-panel/src/components/ui/ImageModal.tsx`)
- Full-screen modal for viewing images
- Fetches signed URL on demand
- Includes download and external link options
- Handles loading states and errors

### 2. Secure Image Viewer (`admin-panel/src/components/ui/SecureImageViewer.tsx`)
- Reusable component for displaying images
- Shows thumbnail with view button
- Opens modal when clicked
- Handles missing files gracefully

### 3. File API (`admin-panel/src/store/api/fileApi.ts`)
- RTK Query hook for fetching signed URLs
- Integrated with Redux store
- Handles caching and error states

## Usage Examples

### Basic Usage
```tsx
import SecureImageViewer from '@/components/ui/SecureImageViewer';

<SecureImageViewer
  fileKey="kyc/user-123/pan/pan_document.pdf"
  fileName="PAN Document"
  className="h-32 w-full"
  showPreview={true}
/>
```

### With Thumbnail
```tsx
<SecureImageViewer
  fileKey="kyc/user-123/aadhar/aadhar_front.jpg"
  fileName="Aadhar Front"
  thumbnailUrl="https://example.com/thumbnail.jpg"
  className="h-24 w-24"
  showPreview={true}
/>
```

### Direct Modal Usage
```tsx
import ImageModal from '@/components/ui/ImageModal';

const [isModalOpen, setIsModalOpen] = useState(false);

<ImageModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  fileKey="kyc/user-123/bank/bank_statement.pdf"
  fileName="Bank Statement"
/>
```

## Security Benefits

1. **No Public Access**: S3 objects remain private
2. **Temporary URLs**: Signed URLs expire in 1 hour
3. **Authentication Required**: Only authenticated users can generate URLs
4. **Audit Trail**: All URL generation is logged
5. **Access Control**: Can be extended with role-based permissions

## Environment Variables Required

```env
AWS_REGION=your-region
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_BUCKET_NAME=your-bucket-name
```

## API Endpoints

- `GET /files/signed-url?key=<file-key>` - Generate signed URL for file
  - Requires: JWT authentication
  - Returns: `{ success: boolean, url: string, expiresIn: number }`

## Error Handling

- Network errors are handled gracefully
- Failed image loads show retry options
- Missing files display placeholder content
- Authentication errors redirect to login
