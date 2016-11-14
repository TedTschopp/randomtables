/*
 * Copyright (C) 1999  John Olsson
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.	 See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
 */

/* Fractal Worldmap Generator Version 2.2
 *
 * Creator: John Olsson
 * Thanks to Carl Burke for interesting discussions and suggestions of
 * how to speed up the generation! :)
 *
 * This program is provided as is, and it's basically a "hack". So if you
 * want a better userinterface, you will have to provide it by yourself!
 *
 * For ideas about how to implement different projections, you can always
 * look in WorldMapGenerator.c (the CGI program that generates the gifs
 * on my www-page (http://www.lysator.liu.se/~johol/fwmg/fwmg.html).
 *
 * Please visit my WWW-pages located at: http://www.lysator.liu.se/~johol/
 * You can send E-Mail to this adress: johol@lysator.liu.se
 *
 * I compile this program with: gcc -O3 worldgen.c -lm -o gengif
 *
 * This program will write the GIF-file to a file which you are
 * prompted to specify.
 *
 * To change size of the generated picture, change the default values
 * of the variables XRange och YRange.
 *
 * You use this program at your own risk! :)
 *
 *
 * When you run the program you are prompted to input three values:
 *
 * Seed:	     This the "seed" used to initialize the random number
 *		     generator. So if you use the same seed, you'll get the
 *		     same sequence of random numbers...
 *
 * Number of faults: This is how many iterations the program will do.
 *		     If you want to know how it works, just enter 1, 2, 3,...
 *		     etc. number of iterations and compare the different
 *		     GIF-files.
 *
 * PercentWater:	  This should be a value between 0 and 100 (you can
 *		     input 1000 also, but I don't know what the program
 *		     is up to then! :) The number tells the "ratio"
 *		     between water and land. If you want a world with
 *		     just a few islands, input a large value (EG. 80 or
 *		     above), if you want a world with nearly no oceans,
 *		     a value near 0 would do that.
 *
 */


/*
#include    <limits.h>
#include    <stdio.h>
#include    <stdlib.h>
#include    <unistd.h>
#include    <time.h>
#include    <string.h>
#include    <math.h>
*/

/* These define:s are for the GIF-saver... */
/* a code_int must be able to hold 2**BITS values of type int, and also -1 */

// typedef int		   code_int;
var code_int;

/*
#ifdef SIGNED_COMPARE_SLOW
typedef unsigned long int count_int;
typedef unsigned short int count_short;
#else //SIGNED_COMPARE_SLOW
typedef long int	  count_int;
#endif //SIGNED_COMPARE_SLOW
*/
var count_int;
var count_short;

/*
static void BumpPixel ( void );
static int GIFNextPixel ( void );
static void GIFEncode (FILE* fp, int GWidth, int GHeight, int GInterlace, int Background, int BitsPerPixel, int Red[], int Green[], int Blue[]);
static void Putword ( int w, FILE* fp );
static void compress ( int init_bits, FILE* outfile );
static void output ( code_int code );
static void cl_block ( void );
static void cl_hash ( count_int hsize );
static void writeerr ( void );
static void char_init ( void );
static void char_out ( int c );
static void flush_char ( void );
*/

/* My own definitions */

/*
#ifndef PI
#define PI	  3.141593
#endif
*/



/* This value holds the maximum value rand() can generate
 *
 * RAND_MAX *might* be defined in stdlib.h, if it's not
 * you *might* have to change the definition of MAX_RAND...
 */

/*
#ifdef RAND_MAX
#define MAX_RAND  RAND_MAX
#else
#define MAX_RAND  0x7FFFFFFF
#endif

*/
var MAX_RAND = Number.MAX_SAFE_INTEGER;
var INT_MIN =  Number.MIN_SAFE_INTEGER;


/* Function that generates the worldmap */
void GenerateWorldMap();

/* 4-connective floodfill algorithm which I use for constructing
 *  the ice-caps.*/
void FloodFill4(int x, int y, int OldColor);


/*
int		*WorldMapArray;
int		XRange = 320;
int		YRange = 160;
int		Histogram[256];
int		FilledPixels;
int		Red[49]	  = {0,0,0,0,0,0,0,0,34,68,102,119,136,153,170,187,
			     0,34,34,119,187,255,238,221,204,187,170,153,
			     136,119,85,68,
			     255,250,245,240,235,230,225,220,215,210,205,200,
			     195,190,185,180,175};
int		Green[49] = {0,0,17,51,85,119,153,204,221,238,255,255,255,
			     255,255,255,68,102,136,170,221,187,170,136,
			     136,102,85,85,68,51,51,34,
			     255,250,245,240,235,230,225,220,215,210,205,200,
			     195,190,185,180,175};
int		Blue[49]  = {0,68,102,136,170,187,221,255,255,255,255,255,
			     255,255,255,255,0,0,0,0,0,34,34,34,34,34,34,
			     34,34,34,17,0,
			     255,250,245,240,235,230,225,220,215,210,205,200,
			     195,190,185,180,175};

float		YRangeDiv2, YRangeDivPI;
float		*SinIterPhi;
*/

var WorldMapArray;
var XRange;
var YRange;
var Histogram = [256];
var FilledPixels;

var Red	  = [  0,  0,  0,  0,0,0,0,0,34,68,102,119,136,153,170,187,0,34,34,119,187,255,238,221,204,187,170,153,136,119,85,68, 255,250,245,240,235,230,225,220,215,210,205,200,195,190,185,180,175];
var Green = [  0,  0, 17, 51,85,119,153,204,221,238,255,255,255,255,255,255,68,102,136,170,221,187,170,136,136,102,85,85,68,51,51,34,255,250,245,240,235,230,225,220,215,210,205,200,195,190,185,180,175];
var Blue  = [  0, 68,102,136,170,187,221,255,255,255,255,255,255,255,255,255,0,0,0,0,0,34,34,34,34,34,34,34,34,34,17,0,255,250,245,240,235,230,225,220,215,210,205,200,195,190,185,180,175];

var YRangeDiv2;
var YRangeDivPI;
var SinIterPhi;


function main(argc, argv) {
// TODO: Remove input variables
	var NumberOfFaults=0;
	var a;
	var j;
	var i;
	var Color;
	var MaxZ=1;
	var MinZ=-1;

	var row
	var TwoColorMode=0;

	var index2;

	var Seed=0;

	var Threshold
	var Count;

	var PrecentWater;
	var PrecentIce;
	var Cur;

	var SaveName = [256];
	var SaveFile = [256];

	var WorldMapArray = [XRange * YRange];
	// TODO: Add Code if out of memory
	var SinIterPhi = [2 * XRange];
	// TODO: Add Code if out of memory

	for (i=0; i<XRange; i++) {
		SinIterPhi[i] = SinIterPhi[i+XRange] = sin(i*2*PI/XRange);
	}

	// TODO: Add in inputs

	srand(seed);

	for (j=0, row=0; j<XRange; j++)
	{
		WorldMapArray[row] = 0;
		for (i=1; i<YRange; i++) {
			WorldMapArray[i+row] = INT_MIN;
		}
			row += YRange;
	  }


}

//void main(int argc, char **argv)
//{
//  int	      NumberOfFaults=0, a, j, i, Color, MaxZ=1, MinZ=-1;
//  int	      row, TwoColorMode=0;
//  int	      index2;
//  unsigned  Seed=0;
//  int	      Threshold, Count;
//  int	      PercentWater, PercentIce, Cur;
//  char SaveName[256];	 /* 255 character filenames should be enough? */
//  char SaveFile[256];	 /* SaveName + .gif */
//  FILE * Save;
//
//  WorldMapArray = (int *) malloc(XRange*YRange*sizeof(int));
//  if (WorldMapArray == NULL)
//  {
//    fprintf(stderr, "I can't allocate enough memory!\n");
//  }
//
//  SinIterPhi = (float *) malloc(2*XRange*sizeof(float));
//  if (SinIterPhi == NULL)
//  {
//    fprintf(stderr, "I can't allocate enough memory!\n");
//  }

//  for (i=0; i<XRange; i++)
//  {
//    SinIterPhi[i] = SinIterPhi[i+XRange] = (float)sin(i*2*PI/XRange);
//  }

  fprintf(stderr, "Seed: ");
  scanf("%d", &Seed);
  fprintf(stderr, "Number of faults: ");
  scanf("%d", &NumberOfFaults);
  fprintf(stderr, "Percent water: ");
  scanf("%d", &PercentWater);
  fprintf(stderr, "Percent ice: ");
  scanf("%d", &PercentIce);

  fprintf(stderr, "Save as (.GIF will be appended): ");
  scanf("%8s", SaveName);

  srand(Seed);

  for (j=0, row=0; j<XRange; j++)
  {
    WorldMapArray[row] = 0;
    for (i=1; i<YRange; i++) WorldMapArray[i+row] = INT_MIN;
    row += YRange;
  }

  /* Define some "constants" which we use frequently */
  YRangeDiv2  = YRange/2;
  YRangeDivPI = YRange/PI;

  /* Generate the map! */
  for (a=0; a<NumberOfFaults; a++)
  {
    GenerateWorldMap();
  }

  /* Copy data (I have only calculated faults for 1/2 the image.
   * I can do this due to symmetry... :) */
  index2 = (XRange/2)*YRange;
  for (j=0, row=0; j<XRange/2; j++)
  {
    for (i=1; i<YRange; i++)			/* fix */
    {
      WorldMapArray[row+index2+YRange-i] = WorldMapArray[row+i];
    }
    row += YRange;
  }

  /* Reconstruct the real WorldMap from the WorldMapArray and FaultArray */
  for (j=0, row=0; j<XRange; j++)
  {
    /* We have to start somewhere, and the top row was initialized to 0,
     * but it might have changed during the iterations... */
    Color = WorldMapArray[row];
    for (i=1; i<YRange; i++)
    {
      /* We "fill" all positions with values != INT_MIN with Color */
      Cur = WorldMapArray[row+i];
      if (Cur != INT_MIN)
      {
				Color += Cur;
      }
      WorldMapArray[row+i] = Color;
    }
    row += YRange;
  }

  /* Compute MAX and MIN values in WorldMapArray */
  for (j=0; j<XRange*YRange; j++)
  {
    Color = WorldMapArray[j];
    if (Color > MaxZ) MaxZ = Color;
    if (Color < MinZ) MinZ = Color;
  }

  /* Compute color-histogram of WorldMapArray.
   * This histogram is a very crude aproximation, since all pixels are
   * considered of the same size... I will try to change this in a
   * later version of this program. */
  for (j=0, row=0; j<XRange; j++)
  {
    for (i=0; i<YRange; i++)
    {
      Color = WorldMapArray[row+i];
      Color = (int)(((float)(Color - MinZ + 1) / (float)(MaxZ-MinZ+1))*30)+1;
      Histogram[Color]++;
    }
    row += YRange;
  }

  /* Threshold now holds how many pixels PercentWater means */
  Threshold = PercentWater*XRange*YRange/100;

  /* "Integrate" the histogram to decide where to put sea-level */
  for (j=0, Count=0;j<256;j++)
  {
    Count += Histogram[j];
    if (Count > Threshold) break;
  }

  /* Threshold now holds where sea-level is */
  Threshold = j*(MaxZ - MinZ + 1)/30 + MinZ;

  if (TwoColorMode)
  {
    for (j=0, row=0; j<XRange; j++)
    {
      for (i=0; i<YRange; i++)
      {
	Color = WorldMapArray[row+i];
	if (Color < Threshold)
	  WorldMapArray[row+i] = 3;
	else
	  WorldMapArray[row+i] = 20;
      }
      row += YRange;
    }
  }
  else
  {
    /* Scale WorldMapArray to colorrange in a way that gives you
     * a certain Ocean/Land ratio */
    for (j=0, row=0; j<XRange; j++)
    {
      for (i=0; i<YRange; i++)
      {
	Color = WorldMapArray[row+i];

	if (Color < Threshold)
	  Color = (int)(((float)(Color - MinZ) / (float)(Threshold - MinZ))*15)+1;
	else
	  Color = (int)(((float)(Color - Threshold) / (float)(MaxZ - Threshold))*15)+16;

	/* Just in case... I DON't want the GIF-saver to flip out! :) */
	if (Color < 1) Color=1;
	if (Color > 255) Color=31;
	WorldMapArray[row+i] = Color;
      }
      row += YRange;
    }

    /* "Recycle" Threshold variable, and, eh, the variable still has something
     * like the same meaning... :) */
    Threshold = PercentIce*XRange*YRange/100;

    if ((Threshold <= 0) || (Threshold > XRange*YRange)) goto Finished;

    FilledPixels = 0;
    /* i==y, j==x */
    for (i=0; i<YRange; i++)
    {
      for (j=0, row=0; j<XRange; j++)
      {
	Color = WorldMapArray[row+i];
	if (Color < 32) FloodFill4(j,i,Color);
	/* FilledPixels is a global variable which FloodFill4 modifies...
	 * I know it's ugly, but as it is now, this is a hack! :)
	 */
	if (FilledPixels > Threshold) goto NorthPoleFinished;
	row += YRange;
      }
    }

NorthPoleFinished:
    FilledPixels=0;
    /* i==y, j==x */
    for (i = (YRange - 1); i>0; i--)		/* fix */
    {
      for (j=0, row=0; j<XRange; j++)
      {
	Color = WorldMapArray[row+i];
	if (Color < 32) FloodFill4(j,i,Color);
	/* FilledPixels is a global variable which FloodFill4 modifies...
	 * I know it's ugly, but as it is now, this is a hack! :)
	 */
	if (FilledPixels > Threshold) goto Finished;
	row += YRange;
      }
    }
Finished:;
  }

  /* append .gif to SaveFile */
  sprintf(SaveFile, "%s.gif", SaveName);
  /* open binary SaveFile */
  Save = fopen(SaveFile, "wb");
  /* Write GIF to savefile */

  GIFEncode(Save, XRange, YRange, 1, 0, 8, Red, Green, Blue);

  fprintf(stderr, "Map created, saved as %s.\n", SaveFile);

  free(WorldMapArray);

  exit(0);
}

void FloodFill4(int x, int y, int OldColor)
{
  if (WorldMapArray[x*YRange+y] == OldColor)
  {
    if (WorldMapArray[x*YRange+y] < 16)
      WorldMapArray[x*YRange+y] = 32;
    else
      WorldMapArray[x*YRange+y] += 17;

    FilledPixels++;
    if (y-1 > 0)      FloodFill4(  x, y-1, OldColor);
    if (y+1 < YRange) FloodFill4(  x, y+1, OldColor);
    if (x-1 < 0)
      FloodFill4(XRange-1, y, OldColor);	/* fix */
    else
      FloodFill4(   x-1, y, OldColor);

    if (x+1 >= XRange)				/* fix */
      FloodFill4(     0, y, OldColor);
    else
      FloodFill4(   x+1, y, OldColor);
  }
}

void GenerateWorldMap()
{
  float		Alpha, Beta;
  float		TanB;
  float		Result, Delta;
  int		i, row, N2;
  int		Theta, Phi, Xsi;
  unsigned int	flag1;


  /* I have to do this because of a bug in rand() in Solaris 1...
   * Here's what the man-page says:
   *
   * "The low bits of the numbers generated are not  very  random;
   *  use  the	middle	bits.  In particular the lowest bit alter-
   *  nates between 0 and 1."
   *
   * So I can't optimize this, but you might if you don't have the
   * same bug... */
  flag1 = rand() & 1; /*(int)((((float) rand())/MAX_RAND) + 0.5);*/

  /* Create a random greatcircle...
   * Start with an equator and rotate it */
  Alpha = (((float) rand())/MAX_RAND-0.5)*PI; /* Rotate around x-axis */
  Beta	= (((float) rand())/MAX_RAND-0.5)*PI; /* Rotate around y-axis */

  TanB	= tan(acos(cos(Alpha)*cos(Beta)));

  row  = 0;
  Xsi  = (int)(XRange/2-(XRange/PI)*Beta);

  for (Phi=0; Phi<XRange/2; Phi++)
  {
    Theta = (int)(YRangeDivPI*atan(*(SinIterPhi+Xsi-Phi+XRange)*TanB))+YRangeDiv2;

    if (flag1)
    {
      /* Rise northen hemisphere <=> lower southern */
      if (WorldMapArray[row+Theta] != INT_MIN)
	WorldMapArray[row+Theta]--;
      else
	WorldMapArray[row+Theta] = -1;
    }
    else
    {
      /* Rise southern hemisphere */
      if (WorldMapArray[row+Theta] != INT_MIN)
	WorldMapArray[row+Theta]++;
      else
	WorldMapArray[row+Theta] = 1;
    }
    row += YRange;
  }
}
