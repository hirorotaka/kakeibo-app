import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { formatCurrency } from '../utils/formatting';

const MonthlySummary = () => {
  return (
    <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} mb={2}>
      {/* 収入 */}
      <Grid item xs={4} display={'flex'} flexDirection={'column'}>
        <Card
          sx={{
            bgcolor: (theme) => theme.palette.incomeColor.main,
            color: 'white',
            borderRadius: '10px',
            flexGrow: 1,
          }}
        >
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
            <Stack direction={'row'} spacing={1}>
              <ArrowUpwardIcon sx={{ fontSize: '2rem' }} />
              <Typography>収入</Typography>
            </Stack>
            <Typography
              textAlign={'right'}
              variant="h5"
              fontWeight={'fontWeightBold'}
              sx={{
                wordBreak: 'break-word',
                fontSize: { xs: '.8rem', sm: '1rem', md: '1.2rem' },
              }}
            >
              {`¥${formatCurrency(10000)}`}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      {/* 支出 */}
      <Grid item xs={4} display={'flex'} flexDirection={'column'}>
        <Card
          sx={{
            bgcolor: (theme) => theme.palette.expenseColor.main,
            color: 'white',
            borderRadius: '10px',
            flexGrow: 1,
          }}
        >
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
            <Stack direction={'row'} spacing={1}>
              <ArrowDownwardIcon sx={{ fontSize: '2rem' }} />
              <Typography>支出</Typography>
            </Stack>
            <Typography
              textAlign={'right'}
              variant="h5"
              fontWeight={'fontWeightBold'}
              sx={{
                wordBreak: 'break-word',
                fontSize: { xs: '.8rem', sm: '1rem', md: '1.2rem' },
              }}
            >
              {`¥${formatCurrency(20000)}`}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      {/* 残高 */}
      <Grid item xs={4} display={'flex'} flexDirection={'column'}>
        <Card
          sx={{
            bgcolor: (theme) => theme.palette.balanceColor.main,
            color: 'white',
            borderRadius: '10px',
            flexGrow: 1,
          }}
        >
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
            <Stack direction={'row'} spacing={1}>
              <AccountBalanceIcon sx={{ fontSize: '2rem' }} />
              <Typography>残高</Typography>
            </Stack>
            <Typography
              textAlign={'right'}
              variant="h5"
              fontWeight={'fontWeightBold'}
              sx={{
                wordBreak: 'break-word',
                fontSize: { xs: '.8rem', sm: '1rem', md: '1.2rem' },
              }}
            >
              {`¥${formatCurrency(30000)}`}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default MonthlySummary;
