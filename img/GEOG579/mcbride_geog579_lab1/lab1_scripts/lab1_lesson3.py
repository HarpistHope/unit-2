# Lab 1: Spatial Autocorrelation
# - Lesson 3: Calculate Moran's I at different spatial resolutions

# Import modules
import arcpy

# Overwrite existing outputs
arcpy.env.overwriteOutput = True

# Set the workspace 
arcpy.env.workspace = "C:/g579_arcpy/lab1/lab1_data"

# Set input raster
inRaster = "depth.rst"
inCellSize = arcpy.GetRasterProperties_management(inRaster, "CELLSIZEX").getOutput(0)
outCellSize = inCellSize
inFileName = inRaster.split('.')[0]
outRaster = inRaster

# Set variables for Resample
resampleingType = "NEAREST"

# Set variables for RasterToPoint
field = "VALUE"

# Set variables for SpatialAutocorrelation
inputField = "grid_code"
generateReport = "NO_REPORT"
spatialRS = "INVERSE_DISTANCE"
distM = "EUCLIDEAN_DISTANCE"
std = "ROW"

# The list to store the Moran Coefficients
moransIL = []

for redFactor in range(1, 17):
    # Generate output file names
    redFactorStr = str(redFactor)
    outPoint = inFileName + redFactorStr + '.shp'

    # Geoprocessing
    try:
        # Resample when reduction factor > 1
        if (redFactor > 1):
                outCellSize = str(int(inCellSize)*redFactor)
                outRaster = inFileName + redFactorStr
                arcpy.management.Resample(inRaster, outRaster, outCellSize, resampleingType)
        
        # Raster to point
        arcpy.conversion.RasterToPoint(outRaster, outPoint, field)

        # Compute the Moran Coefficient
        moransI = arcpy.stats.SpatialAutocorrelation(outPoint, inputField, generateReport, spatialRS, distM, std, None, None, None)

        # Add the current Moran Coefficient to the list
        moransIL.append(moransI)

    except:
        # If an error occurred when running the tool, print out the error message.
        print(arcpy.GetMessages())

# Print the list of Moran Coefficients
print("List of Moran Coefficients:")
for i in range(len(moransIL)):
    print(str(i+1), moransIL[i])

