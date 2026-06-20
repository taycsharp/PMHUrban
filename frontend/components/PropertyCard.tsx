import Link from "next/link";
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Property } from "@/types";
import { propertyPrice } from "@/lib/sample-data";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", transition: "transform .18s ease, box-shadow .18s ease", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 10px 28px rgba(15,79,63,.16)" } }}>
      <Box sx={{ position: "relative", aspectRatio: "4 / 3", backgroundImage: `url(${property.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <Stack direction="row" spacing={1} sx={{ position: "absolute", top: 10, left: 10 }}>
          <Chip size="small" color={property.listingType === "rent" ? "primary" : "secondary"} label={property.listingType === "rent" ? "For rent" : "For sale"} />
          {property.isVerified && <Chip size="small" icon={<VerifiedIcon />} label="Verified" />}
        </Stack>
      </Box>
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1.5, flex: 1 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip size="small" label={property.propertyType} />
          <Chip size="small" label={property.viewType} />
          {property.parking && <Chip size="small" label="Parking" />}
        </Stack>
        <Typography variant="h6" sx={{ fontSize: 18, lineHeight: 1.3 }}>
          {property.title}
        </Typography>
        <Typography color="text.secondary">{property.project}, Phu My Hung</Typography>
        <Typography variant="h6" color="primary.main">
          {propertyPrice(property)}
        </Typography>
        <Stack direction="row" spacing={2} color="text.secondary">
          <Stack direction="row" spacing={0.5} alignItems="center"><BedIcon fontSize="small" /> <span>{property.bedrooms}</span></Stack>
          <Stack direction="row" spacing={0.5} alignItems="center"><BathtubIcon fontSize="small" /> <span>{property.bathrooms}</span></Stack>
          <Stack direction="row" spacing={0.5} alignItems="center"><SquareFootIcon fontSize="small" /> <span>{property.areaSqm} m2</span></Stack>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {property.furnitureStatus.replace("_", " ")} - {property.availableFrom}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Button component={Link} href={`/properties/${property.slug}`} variant="outlined">
          View Phu My Hung home
        </Button>
      </CardContent>
    </Card>
  );
}
