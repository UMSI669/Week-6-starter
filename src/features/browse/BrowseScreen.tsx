import { Link } from 'expo-router';
import { PlaceholderScreen } from '../../components/PlaceholderScreen';

export default function BrowseScreen() {
  return (
    <PlaceholderScreen eyebrow="DISCOVER" title="Find your next movie" description="Movie browsing and search are coming soon." symbol="▤">
      <Link href="/my-list" style={{ color: '#3155A6', fontSize: 16, padding: 16 }}>Go to My List →</Link>
    </PlaceholderScreen>
  );
}
