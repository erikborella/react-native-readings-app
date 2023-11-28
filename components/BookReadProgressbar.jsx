import { View } from 'react-native';

import {
    Text,
    ProgressBar
} from 'react-native-paper';

export function BookReadProgressbar({ readPercentage }) {

    function getBookProgressColor (progress) {
        const initialColor = [255, 0, 0];
        const middleColor = [255, 255, 0];
        const endColor = [0, 255, 0];
    
        const intermediary = [
          initialColor[0] + progress * (middleColor[0] - initialColor[0]),
          initialColor[1] + progress * (middleColor[1] - initialColor[1]),
          initialColor[2] + progress * (middleColor[2] - initialColor[2]),
        ];
    
        const intermediary2 = [
          middleColor[0] + progress * (endColor[0] - middleColor[0]),
          middleColor[1] + progress * (endColor[1] - middleColor[1]),
          middleColor[2] + progress * (endColor[2] - middleColor[2]),
        ];
    
        const final = [
          intermediary[0] + progress * (intermediary2[0] - intermediary[0]),
          intermediary[1] + progress * (intermediary2[1] - intermediary[1]),
          intermediary[2] + progress * (intermediary2[2] - intermediary[2]),
        ];
    
        return `rgb(${Math.round(final[0])}, ${Math.round(final[1])}, ${Math.round(final[2])})`;
    };

    return (
        <View style={{ flex: 1 }}>
            <View>
                <ProgressBar color={getBookProgressColor(readPercentage)} style={{ height: 10, borderRadius: 10 }} progress={readPercentage} />
                <Text style={{ textAlign: "right" }}>{`${Math.floor(readPercentage * 100)}%`}</Text>
            </View>
        </View>
    )
}