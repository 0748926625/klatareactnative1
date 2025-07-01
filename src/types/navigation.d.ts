import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Login: undefined;
  Main: { currentUser: string };
  Stats: undefined;
};

export type NavigationProps = StackNavigationProp<RootStackParamList>;
