import { Link } from 'expo-router';
import { PlaceholderScreen } from '../../components/PlaceholderScreen';

export default function MyListScreen() {
  return (
    <PlaceholderScreen eyebrow="YOUR COLLECTION" title="A place for your favorites" description="Your saved movies will appear here once saving is available." symbol="♡">
      <Link href="/" style={{ color: '#3155A6', fontSize: 16, padding: 16 }}>Explore Browse →</Link>
    </PlaceholderScreen>
  );
}
