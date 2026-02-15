# Lab 1: Spatial Autocorrelation
# - Lesson 1: Basic geoprocessing functions

# Import modules
import arcpy

# Overwrite existing outputs
arcpy.env.overwriteOutput = True

# Set the workspace 
arcpy.env.workspace = "C:/g579_arcpy/lab1/lab1_data"

# Set variables for RasterToPoint
inRaster = "depth.rst"
outPoint = "depth.shp"
field = "VALUE"

# Raster to point
arcpy.conversion.RasterToPoint(inRaster, outPoint, field)

# Set variables for SpatialAutocorrelation
inputField = "grid_code"
generateReport = "NO_REPORT"
spatialRS = "INVERSE_DISTANCE"
distM = "EUCLIDEAN_DISTANCE"
std = "ROW"

# Compute the Moran Coefficient
moransI = arcpy.stats.SpatialAutocorrelation(outPoint, "grid_code", "NO_REPORT", "INVERSE_DISTANCE", "EUCLIDEAN_DISTANCE", "ROW", None, None, None)

# Print Moran's I
print(moransI[0])

# Resampling
# Set variables for resampling
outRaster = "depth2"
outCellSize = "60"
resampleingType = "NEAREST"

# Resample
arcpy.management.Resample(inRaster, outRaster, outCellSize, resampleingType)
