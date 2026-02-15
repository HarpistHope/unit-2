# Lab 1: Spatial Autocorrelation
# - Lesson 2: Debugging and handling errors

# Import modules
import arcpy

# Overwrite existing outputs
arcpy.env.overwriteOutput = True

# Set the workspace 
arcpy.env.workspace = "C:/g579_arcpy/lab1/lab1_data"

# Set variables for RasterToPoint
inRaster = "depth.rst"
outPoint = "depth.shp"
field = "VALU"

try:
    # Raster to point
    arcpy.conversion.RasterToPoint(inRaster, outPoint, field)
    
except:
    # If an error occurred when running the tool, print out the error message.
    print(arcpy.GetMessages())


