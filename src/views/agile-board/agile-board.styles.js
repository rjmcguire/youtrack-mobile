import {StyleSheet} from 'react-native';
import {UNIT} from '../../components/variables/variables';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  rowContainerZoomedOut: {
    transform: [{scale: 0.8}]
  },
  loadingMoreIndicator: {
    padding: UNIT * 2
  },
  zoomButtonContainer: {
    opacity: 0.7,
    position: 'absolute',

    right: UNIT * 2,
    bottom: UNIT * 2
  },
  zoomButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#FFFFFF',
    borderRadius: UNIT * 4,

    width: UNIT * 8,
    height: UNIT * 8,

    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {
      height: 2,
      width: 0
    }
  },
  zoomButtonIcon: {
    opacity: 0.8,
    marginTop: 4,
    width: UNIT * 3.5,
    height: UNIT * 3.5
  }
});
