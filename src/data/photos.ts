export type Photo = {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  date?: string;
  location?: string;
  tags?: string[];
};

export type PhotoCollection = {
  id: string;
  label: string;
  description?: string;
  coverUrl: string;
  photos?: Photo[];
  collections?: PhotoCollection[]; // sub-collections
};

/** Helper: count all photos in a collection tree (including sub-collections) */
export function countPhotos(collection: PhotoCollection): number {
  const direct = collection.photos?.length ?? 0;
  const nested = (collection.collections ?? []).reduce(
    (sum, sub) => sum + countPhotos(sub),
    0
  );
  return direct + nested;
}

/** Helper: collect all photos from a collection tree (flattened) */
export function getAllPhotos(collection: PhotoCollection): Photo[] {
  const direct = collection.photos ?? [];
  const nested = (collection.collections ?? []).flatMap(getAllPhotos);
  return [...direct, ...nested];
}

/** Helper: find a collection by id anywhere in the tree */
export function findCollection(
  collections: PhotoCollection[],
  id: string
): PhotoCollection | null {
  for (const c of collections) {
    if (c.id === id) return c;
    if (c.collections) {
      const found = findCollection(c.collections, id);
      if (found) return found;
    }
  }
  return null;
}

const photos: PhotoCollection[] = [
  {
    id: "adventures",
    label: "Adventures",
    description: "Exploring the great outdoors",
    coverUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    collections: [
      {
        id: "blue-mountains",
        label: "Blue Mountains",
        description: "Misty peaks and ancient valleys",
        coverUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        photos: [
          {
            id: "bm-1",
            title: "Mountain Summit",
            description: "View from the top",
            imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
            thumbnailUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
            location: "Blue Mountains, NSW",
            tags: ["hiking", "mountains"],
          },
          {
            id: "bm-2",
            title: "Three Sisters",
            description: "Iconic rock formation at dusk",
            imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=800&fit=crop",
            thumbnailUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop",
            location: "Blue Mountains, NSW",
            tags: ["hiking", "mountains", "sunset"],
          },
        ],
      },
      {
        id: "daintree",
        label: "Daintree",
        description: "World's oldest rainforest",
        coverUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
        photos: [
          {
            id: "dt-1",
            title: "Forest Trail",
            description: "Morning hike through the trees",
            imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop",
            thumbnailUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
            location: "Daintree, QLD",
            tags: ["hiking", "forest"],
          },
          {
            id: "dt-2",
            title: "Canopy Walk",
            description: "Above the treetops",
            imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&h=800&fit=crop",
            thumbnailUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=300&fit=crop",
            location: "Daintree, QLD",
            tags: ["forest", "canopy"],
          },
        ],
      },
      {
        id: "bondi",
        label: "Bondi Coastal",
        description: "Where the land meets the sea",
        coverUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
        photos: [
          {
            id: "bc-1",
            title: "Coastal Walk",
            description: "Cliffside path at sunrise",
            imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop",
            thumbnailUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
            location: "Bondi, NSW",
            tags: ["coast", "walking"],
          },
        ],
      },
    ],
  },
  {
    id: "travel",
    label: "Travel",
    description: "Places I've been lucky enough to visit",
    coverUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop",
    photos: [
      {
        id: "travel-1",
        title: "Tokyo Nights",
        description: "Neon-lit streets of Shinjuku",
        imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&h=800&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop",
        location: "Tokyo, Japan",
        tags: ["city", "night"],
      },
      {
        id: "travel-2",
        title: "Sydney Harbour",
        description: "The iconic bridge at golden hour",
        imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&h=800&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=300&fit=crop",
        location: "Sydney, NSW",
        tags: ["city", "harbour"],
      },
      {
        id: "travel-3",
        title: "Great Barrier Reef",
        description: "Underwater wonderland",
        imageUrl: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=1200&h=800&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=400&h=300&fit=crop",
        location: "Cairns, QLD",
        tags: ["ocean", "diving"],
      },
      {
        id: "travel-4",
        title: "Uluru at Sunset",
        description: "The heart of Australia",
        imageUrl: "https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=1200&h=800&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=400&h=300&fit=crop",
        location: "Uluru, NT",
        tags: ["outback", "sunset"],
      },
    ],
  },
  {
    id: "tech",
    label: "Tech & Builds",
    description: "Workstation setups and side projects",
    coverUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
    photos: [
      {
        id: "tech-1",
        title: "Dev Setup",
        description: "Where the magic happens",
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=800&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
        tags: ["workspace", "coding"],
      },
      {
        id: "tech-2",
        title: "Server Rack",
        description: "Homelab in progress",
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=800&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
        tags: ["homelab", "hardware"],
      },
    ],
  },
];

export default photos;
