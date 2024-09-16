import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { useTheme } from '@emotion/react';
import { tokens } from '../theme';
import { useNavigate } from 'react-router-dom';

const DegreeCard = ({taskId, degreeId, degreeName, totalStudents, degreeAgent}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate()
  const handleClick = () => {
    navigate(`/task/${taskId}/${degreeId}`);
  };
  return (
    <Card onClick={handleClick} sx={{ maxWidth: 345, background: colors.grey[100] }} >
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" color={colors.grey[900]}>
            {degreeName}
          </Typography>
          <Typography variant="body2" color={colors.grey[900]}>
            Total number of Students: {totalStudents}
          </Typography>
          <Typography variant="body2" color={colors.grey[900]}>
            Agent: {degreeAgent}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default DegreeCard